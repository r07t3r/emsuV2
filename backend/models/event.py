
from datetime import datetime
from ..app import db

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    event_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)
    location = db.Column(db.String(200))
    event_type = db.Column(db.String(50))  # academic, sports, cultural, meeting, holiday
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    is_public = db.Column(db.Boolean, default=True)
    max_participants = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    organizer = db.relationship('User', backref='organized_events')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'eventDate': self.event_date.isoformat(),
            'endDate': self.end_date.isoformat() if self.end_date else None,
            'location': self.location,
            'eventType': self.event_type,
            'organizerId': self.organizer_id,
            'organizerName': f"{self.organizer.first_name} {self.organizer.last_name}" if self.organizer else None,
            'isPublic': self.is_public,
            'maxParticipants': self.max_participants,
            'createdAt': self.created_at.isoformat()
        }
