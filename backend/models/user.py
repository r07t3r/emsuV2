
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from ..app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, principal, teacher, accountant, receptionist
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    profile_picture = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    last_login = db.Column(db.DateTime)

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
            'profilePicture': self.profile_picture,
            'phone': self.phone,
            'lastLogin': self.last_login.isoformat() if self.last_login else None,
            'createdAt': self.created_at.isoformat()
        }
