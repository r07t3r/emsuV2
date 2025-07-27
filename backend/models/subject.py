
from ..app import db

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.Text)
    credits = db.Column(db.Integer, default=1)
    grade_level = db.Column(db.String(20))
    department = db.Column(db.String(100))
    is_mandatory = db.Column(db.Boolean, default=True)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'credits': self.credits,
            'gradeLevel': self.grade_level,
            'department': self.department,
            'isMandatory': self.is_mandatory,
            'isActive': self.is_active
        }
