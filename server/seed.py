#!/usr/bin/env python3

import random
from faker import Faker
from datetime import datetime, timedelta
from app import app, db, bcrypt
from models import User, Event, Registration

fake = Faker()

def create_users(num_users=10):
    users = []
    for _ in range(num_users):
        user = User(
            name=fake.name(),
            username=fake.user_name(),
            email=fake.email(),
            password_hash=bcrypt.generate_password_hash(fake.password()).decode('utf-8')
        )
        users.append(user)
        db.session.add(user)
    db.session.commit()
    return users

def create_events(users, num_events=50):
    events = []
    for _ in range(num_events):
        user = random.choice(users)
        event = Event(
            title=fake.sentence(nb_words=5),
            description=fake.text(max_nb_chars=200),
            date=fake.date_time_between(start_date='-1y', end_date='+1y'),
            location=fake.city(),
            creator_id=user.id
        )
        events.append(event)
        db.session.add(event)
    db.session.commit()
    return events

def create_registrations(users, events, num_registrations=100):
    for _ in range(num_registrations):
        user = random.choice(users)
        event = random.choice(events)
        registration = Registration(
            user_id=user.id,
            event_id=event.id,
            review=fake.sentence()
        )
        db.session.add(registration)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        users = create_users(10)
        events = create_events(users, 50)
        create_registrations(users, events, 100)
        
        print("Seeding complete!")