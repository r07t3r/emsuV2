
from datetime import datetime
from ..app import db

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
    profile_picture = db.Column(db.String(255))
    medical_info = db.Column(db.Text)
    emergency_contact = db.Column(db.String(20))
    transport_mode = db.Column(db.String(50))  # bus, private, walking
    blood_group = db.Column(db.String(5))

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
            'guardianEmail': self.guardian_email,
            'profilePicture': self.profile_picture,
            'medicalInfo': self.medical_info,
            'emergencyContact': self.emergency_contact,
            'transportMode': self.transport_mode,
            'bloodGroup': self.blood_group
        }
