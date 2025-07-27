
from ..app import db

class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(20), nullable=False)
    section = db.Column(db.String(10), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'))
    room_number = db.Column(db.String(10))
    capacity = db.Column(db.Integer, default=30)
    is_active = db.Column(db.Boolean, default=True)
    schedule = db.Column(db.Text)  # JSON string for class schedule
    academic_year = db.Column(db.String(10))

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
            'isActive': self.is_active,
            'schedule': self.schedule,
            'academicYear': self.academic_year
        }
