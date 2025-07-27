
from datetime import datetime
from ..app import db

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # present, absent, late, excused
    marked_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    time_in = db.Column(db.Time)
    time_out = db.Column(db.Time)

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
            'notes': self.notes,
            'timeIn': self.time_in.isoformat() if self.time_in else None,
            'timeOut': self.time_out.isoformat() if self.time_out else None,
            'createdAt': self.created_at.isoformat()
        }
