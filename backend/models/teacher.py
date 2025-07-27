
from datetime import datetime
from ..app import db

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
    profile_picture = db.Column(db.String(255))
    experience_years = db.Column(db.Integer)
    department = db.Column(db.String(100))
    specialization = db.Column(db.String(200))
    emergency_contact = db.Column(db.String(20))
    blood_group = db.Column(db.String(5))

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
            'isActive': self.is_active,
            'profilePicture': self.profile_picture,
            'experienceYears': self.experience_years,
            'department': self.department,
            'specialization': self.specialization,
            'emergencyContact': self.emergency_contact,
            'bloodGroup': self.blood_group
        }
