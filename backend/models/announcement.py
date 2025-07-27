
from datetime import datetime
from ..app import db

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    target_audience = db.Column(db.String(50), nullable=False)  # all, students, teachers, parents
    priority = db.Column(db.String(20), default='normal')  # low, normal, high, urgent
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    attachment_url = db.Column(db.String(255))

    author = db.relationship('User', backref='announcements')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'authorId': self.author_id,
            'authorName': f"{self.author.first_name} {self.author.last_name}",
            'targetAudience': self.target_audience,
            'priority': self.priority,
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat(),
            'expiresAt': self.expires_at.isoformat() if self.expires_at else None,
            'attachmentUrl': self.attachment_url
        }
