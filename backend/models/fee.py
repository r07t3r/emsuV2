
from datetime import datetime
from ..app import db

class Fee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    fee_type = db.Column(db.String(50), nullable=False)  # tuition, library, lab, transport, exam, misc
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    paid_amount = db.Column(db.Float, default=0)
    status = db.Column(db.String(20), default='Pending')  # Pending, Paid, Overdue, Partial, Waived
    payment_date = db.Column(db.DateTime)
    payment_method = db.Column(db.String(50))  # Cash, Card, Online, Cheque, Bank Transfer
    semester = db.Column(db.String(20))
    academic_year = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_id = db.Column(db.String(100))
    discount_amount = db.Column(db.Float, default=0)
    late_fee = db.Column(db.Float, default=0)
    receipt_number = db.Column(db.String(50))

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
            'transactionId': self.transaction_id,
            'discountAmount': self.discount_amount,
            'lateFee': self.late_fee,
            'receiptNumber': self.receipt_number,
            'createdAt': self.created_at.isoformat()
        }
