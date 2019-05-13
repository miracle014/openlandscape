from flask import Flask , jsonify
app = Flask(__name__)

@app.route("/")
def hello():
    return jsonify(
        movie='XYZ',
        Description='Hello XYZ'
    )

