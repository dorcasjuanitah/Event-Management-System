#!/usr/bin/env python3

# Standard library imports
import random
import os
from datetime import timedelta

# Third-party imports
from flask import Flask, request, make_response
from flask_restful import Resource, Api
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from flask_cors import CORS  # Import CORS

# Local imports
from config import app, db
from models import User, Event, Registration

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "dcvbgftyukns6qad" + str(random.randint(1, 10000000000))
app.config["SECRET_KEY"] = "s6hjx0an2mzoret" + str(random.randint(1, 1000000000))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

db.init_app(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
api = Api(app)
CORS(app)  # Apply CORS

BLACKLIST = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLACKLIST

class Home(Resource):
    def get(self):
        response_body = {
            'message': 'Welcome to our Events Management Application'
        }
        return make_response(response_body, 200)

api.add_resource(Home, '/')

class Login(Resource):
    def post(self):
        email = request.json.get('email')
        password = request.json.get('password')

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            response_body = {
                'access_token': access_token
            }
            return make_response(response_body, 200)
        else:
            response_body = {
                'message': 'Access Denied: Username or password incorrect'
            }
            return make_response(response_body, 401)

api.add_resource(Login, '/login')

class Current_User(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if current_user:
            current_user_dict = current_user.to_dict()
            return make_response(current_user_dict, 200)
        else:
            response_body = {
                'message': 'User not found'
            }
            return make_response(response_body, 404)

api.add_resource(Current_User, '/current_user')

class Logout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        BLACKLIST.add(jti)
        response_body = {
            'message': 'Successfully logged out'
        }
        return make_response(response_body, 200)

api.add_resource(Logout, '/logout')

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)

    def post(self):
        try:
            new_user = User(
                name=request.json['name'],
                email=request.json['email'],
                username=request.json['username'],
                password_hash=bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
            )
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(), 201)
        except Exception as e:
            response_body = {'error': str(e)}
            return make_response(response_body, 400)

api.add_resource(Users, '/users')

class UsersByID(Resource):
    def get(self, id):
        user = User.query.get(id)
        if user:
            return make_response(user.to_dict(), 200)
        else:
            response_body = {'message': 'User not found'}
            return make_response(response_body, 404)

    def delete(self, id):
        user = User.query.get(id)
        if user:
            db.session.delete(user)
            db.session.commit()
            response_body = {'message': 'User deleted successfully'}
            return make_response(response_body, 200)
        else:
            response_body = {'message': 'User not found'}
            return make_response(response_body, 404)

    def patch(self, id):
        user = User.query.get(id)
        if user:
            try:
                for attr in request.json:
                    setattr(user, attr, request.json.get(attr))
                db.session.commit()
                return make_response(user.to_dict(), 200)
            except Exception as e:
                response_body = {'error': str(e)}
                return make_response(response_body, 400)
        else:
            response_body = {'message': 'User not found'}
            return make_response(response_body, 404)

api.add_resource(UsersByID, '/users/<int:id>')

class Events(Resource):
    def get(self):
        events = [event.to_dict() for event in Event.query.all()]
        return make_response(events, 200)

    def post(self):
        try:
            new_event = Event(
                title=request.json['title'],
                description=request.json['description'],
                date=request.json['date'],
                location=request.json['location'],
                creator_id=request.json['creator_id']
            )
            db.session.add(new_event)
            db.session.commit()
            return make_response(new_event.to_dict(), 201)
        except Exception as e:
            response_body = {'error': str(e)}
            return make_response(response_body, 400)

api.add_resource(Events, '/events')

class EventsByID(Resource):
    def get(self, id):
        event = Event.query.get(id)
        if event:
            return make_response(event.to_dict(), 200)
        else:
            response_body = {'message': 'Event not found'}
            return make_response(response_body, 404)

    def delete(self, id):
        event = Event.query.get(id)
        if event:
            db.session.delete(event)
            db.session.commit()
            response_body = {'message': 'Event deleted successfully'}
            return make_response(response_body, 200)
        else:
            response_body = {'message': 'Event not found'}
            return make_response(response_body, 404)

    def patch(self, id):
        event = Event.query.get(id)
        if event:
            try:
                for attr in request.json:
                    setattr(event, attr, request.json.get(attr))
                db.session.commit()
                return make_response(event.to_dict(), 200)
            except Exception as e:
                response_body = {'error': str(e)}
                return make_response(response_body, 400)
        else:
            response_body = {'message': 'Event not found'}
            return make_response(response_body, 404)

api.add_resource(EventsByID, '/events/<int:id>')

class Registrations(Resource):
    def get(self):
        registrations = [registration.to_dict() for registration in Registration.query.all()]
        return make_response(registrations, 200)

    def post(self):
        try:
            # Assuming 'user_id' defaults to 1 here
            new_registration = Registration(
                registered_at=request.json.get('registered_at', None),
                review=request.json['review'],
                
                event_id=request.json['event_id']
            )
            db.session.add(new_registration)
            db.session.commit()
            return make_response(new_registration.to_dict(), 201)
        except Exception as e:
            response_body = {'error': str(e)}
            return make_response(response_body, 400)

api.add_resource(Registrations, '/registrations')

class RegistrationsByID(Resource):
    def get(self, id):
        registration = Registration.query.get(id)
        if registration:
            return make_response(registration.to_dict(), 200)
        else:
            response_body = {'message': 'Registration not found'}
            return make_response(response_body, 404)

    def delete(self, id):
        registration = Registration.query.get(id)
        if registration:
            db.session.delete(registration)
            db.session.commit()
            response_body = {'message': 'Registration deleted successfully'}
            return make_response(response_body, 200)
        else:
            response_body = {'message': 'Registration not found'}
            return make_response(response_body, 404)

    def patch(self, id):
        registration = Registration.query.get(id)
        if registration:
            try:
                for attr in request.json:
                    setattr(registration, attr, request.json.get(attr))
                db.session.commit()
                return make_response(registration.to_dict(), 200)
            except Exception as e:
                response_body = {'error': str(e)}
                return make_response(response_body, 400)
        else:
            response_body = {'message': 'Registration not found'}
            return make_response(response_body, 404)

api.add_resource(RegistrationsByID, '/registrations/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)