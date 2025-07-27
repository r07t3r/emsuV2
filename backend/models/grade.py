
from datetime import datetime
from ..app import db

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    exam_type = db.Column(db.String(50), nullable=False)  # quiz, midterm, final, assignment, project
    marks_obtained = db.Column(db.Float, nullable=False)
    total_marks = db.Column(db.Float, nullable=False)
    grade_letter = db.Column(db.String(2))
    semester = db.Column(db.String(20))
    academic_year = db.Column(db.String(10))
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    exam_date = db.Column(db.Date)
    remarks = db.Column(db.Text)
    weight = db.Column(db.Float, default=1.0)  # Weight for calculating overall grade

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
            'examDate': self.exam_date.isoformat() if self.exam_date else None,
            'remarks': self.remarks,
            'weight': self.weight,
            'createdAt': self.created_at.isoformat()
        }
