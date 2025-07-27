from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///emsu.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=["http://localhost:3000", "https://your-frontend-domain.replit.app"])

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.student_routes import student_bp
    from .routes.teacher_routes import teacher_bp
    from .routes.class_routes import class_bp
    from .routes.attendance_routes import attendance_bp
    from .routes.grade_routes import grade_bp
    from .routes.fee_routes import fee_bp
    from .routes.dashboard_routes import dashboard_bp
    from .routes.report_routes import report_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(student_bp, url_prefix='/api/students')
    app.register_blueprint(teacher_bp, url_prefix='/api/teachers')
    app.register_blueprint(class_bp, url_prefix='/api/classes')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(grade_bp, url_prefix='/api/grades')
    app.register_blueprint(fee_bp, url_prefix='/api/fees')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(report_bp, url_prefix='/api/reports')

    # Database Models (moved from original app.py)
    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        email = db.Column(db.String(120), unique=True, nullable=False)
        password_hash = db.Column(db.String(128))
        first_name = db.Column(db.String(80), nullable=False)
        last_name = db.Column(db.String(80), nullable=False)
        role = db.Column(db.String(20), nullable=False)  # admin, principal, teacher, accountant, receptionist
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        is_active = db.Column(db.Boolean, default=True)

        def set_password(self, password):
            self.password_hash = generate_password_hash(password)

        def check_password(self, password):
            return check_password_hash(self.password_hash, password)

        def to_dict(self):
            return {
                'id': self.id,
                'email': self.email,
                'firstName': self.first_name,
                'lastName': self.last_name,
                'role': self.role,
                'isActive': self.is_active,
                'createdAt': self.created_at.isoformat()
            }

    class Student(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        student_id = db.Column(db.String(20), unique=True, nullable=False)
        first_name = db.Column(db.String(80), nullable=False)
        last_name = db.Column(db.String(80), nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
        phone = db.Column(db.String(20))
        address = db.Column(db.Text)
        date_of_birth = db.Column(db.Date)
        grade = db.Column(db.String(20), nullable=False)
        enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
        is_active = db.Column(db.Boolean, default=True)
        guardian_name = db.Column(db.String(100))
        guardian_phone = db.Column(db.String(20))
        guardian_email = db.Column(db.String(120))

        def to_dict(self):
            return {
                'id': self.id,
                'studentId': self.student_id,
                'firstName': self.first_name,
                'lastName': self.last_name,
                'email': self.email,
                'phone': self.phone,
                'address': self.address,
                'dateOfBirth': self.date_of_birth.isoformat() if self.date_of_birth else None,
                'grade': self.grade,
                'enrollmentDate': self.enrollment_date.isoformat(),
                'isActive': self.is_active,
                'guardianName': self.guardian_name,
                'guardianPhone': self.guardian_phone,
                'guardianEmail': self.guardian_email
            }

    class Teacher(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        teacher_id = db.Column(db.String(20), unique=True, nullable=False)
        first_name = db.Column(db.String(80), nullable=False)
        last_name = db.Column(db.String(80), nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
        phone = db.Column(db.String(20))
        address = db.Column(db.Text)
        subject = db.Column(db.String(100))
        qualification = db.Column(db.String(200))
        hire_date = db.Column(db.DateTime, default=datetime.utcnow)
        salary = db.Column(db.Float)
        is_active = db.Column(db.Boolean, default=True)

        def to_dict(self):
            return {
                'id': self.id,
                'teacherId': self.teacher_id,
                'firstName': self.first_name,
                'lastName': self.last_name,
                'email': self.email,
                'phone': self.phone,
                'address': self.address,
                'subject': self.subject,
                'qualification': self.qualification,
                'hireDate': self.hire_date.isoformat(),
                'salary': self.salary,
                'isActive': self.is_active
            }

    class Class(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(100), nullable=False)
        grade = db.Column(db.String(20), nullable=False)
        section = db.Column(db.String(10), nullable=False)
        teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'))
        room_number = db.Column(db.String(10))
        capacity = db.Column(db.Integer, default=30)
        is_active = db.Column(db.Boolean, default=True)

        teacher = db.relationship('Teacher', backref='classes')

        def to_dict(self):
            return {
                'id': self.id,
                'name': self.name,
                'grade': self.grade,
                'section': self.section,
                'teacherId': self.teacher_id,
                'teacherName': f"{self.teacher.first_name} {self.teacher.last_name}" if self.teacher else None,
                'roomNumber': self.room_number,
                'capacity': self.capacity,
                'isActive': self.is_active
            }

    class Attendance(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
        class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
        date = db.Column(db.Date, nullable=False)
        status = db.Column(db.String(20), nullable=False)  # present, absent, late
        marked_by = db.Column(db.Integer, db.ForeignKey('user.id'))
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        student = db.relationship('Student', backref='attendances')
        class_ = db.relationship('Class', backref='attendances')
        marked_by_user = db.relationship('User', backref='marked_attendances')

        def to_dict(self):
            return {
                'id': self.id,
                'studentId': self.student_id,
                'studentName': f"{self.student.first_name} {self.student.last_name}",
                'classId': self.class_id,
                'className': self.class_.name,
                'date': self.date.isoformat(),
                'status': self.status,
                'markedBy': self.marked_by,
                'createdAt': self.created_at.isoformat()
            }

    class Grade(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
        subject = db.Column(db.String(100), nullable=False)
        exam_type = db.Column(db.String(50), nullable=False)  # quiz, midterm, final, assignment
        marks_obtained = db.Column(db.Float, nullable=False)
        total_marks = db.Column(db.Float, nullable=False)
        grade_letter = db.Column(db.String(2))
        semester = db.Column(db.String(20))
        academic_year = db.Column(db.String(10))
        teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'))
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        student = db.relationship('Student', backref='grades')
        teacher = db.relationship('Teacher', backref='grades_given')

        def to_dict(self):
            return {
                'id': self.id,
                'studentId': self.student_id,
                'studentName': f"{self.student.first_name} {self.student.last_name}",
                'subject': self.subject,
                'examType': self.exam_type,
                'marksObtained': self.marks_obtained,
                'totalMarks': self.total_marks,
                'gradeLetter': self.grade_letter,
                'percentage': round((self.marks_obtained / self.total_marks) * 100, 2),
                'semester': self.semester,
                'academicYear': self.academic_year,
                'teacherId': self.teacher_id,
                'teacherName': f"{self.teacher.first_name} {self.teacher.last_name}" if self.teacher else None,
                'createdAt': self.created_at.isoformat()
            }

    class Fee(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
        fee_type = db.Column(db.String(50), nullable=False)  # tuition, library, lab, transport
        amount = db.Column(db.Float, nullable=False)
        due_date = db.Column(db.Date, nullable=False)
        paid_amount = db.Column(db.Float, default=0)
        status = db.Column(db.String(20), default='Pending')  # Pending, Paid, Overdue, Partial
        payment_date = db.Column(db.DateTime)
        payment_method = db.Column(db.String(50))
        semester = db.Column(db.String(20))
        academic_year = db.Column(db.String(10))
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        student = db.relationship('Student', backref='fees')

        def to_dict(self):
            return {
                'id': self.id,
                'studentId': self.student_id,
                'studentName': f"{self.student.first_name} {self.student.last_name}",
                'feeType': self.fee_type,
                'amount': self.amount,
                'dueDate': self.due_date.isoformat(),
                'paidAmount': self.paid_amount,
                'status': self.status,
                'paymentDate': self.payment_date.isoformat() if self.payment_date else None,
                'paymentMethod': self.payment_method,
                'semester': self.semester,
                'academicYear': self.academic_year,
                'createdAt': self.created_at.isoformat()
            }
    return app

def init_database(app):
    with app.app_context():
        from .models import User
        db.create_all()

        # Create default admin user if not exists
        admin = User.query.filter_by(email='admin@emsu.edu').first()
        if not admin:
            admin = User(
                email='admin@emsu.edu',
                first_name='System',
                last_name='Administrator',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

if __name__ == '__main__':
    app = create_app()
    init_database(app)
    app.run(host='0.0.0.0', port=5000, debug=True)