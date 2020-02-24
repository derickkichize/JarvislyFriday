from pymongo import MongoClient

def migrate_process(magazine):
    client = MongoClient('localhost',27017)
    db = client['inpi_core']
    collection = db['magazine']
    collection.insert_one(magazine)

def migrate_follow_up(follow_up):
    client = MongoClient('localhost',27017)
    db = client['inpi_core']
    collection = db['follow_up']
    collection.insert(follow_up)

def exists(processo):
    client = MongoClient('localhost',27017)
    db = client['inpi_core']
    collection = db['follow_up'];
    if collection.find_one({ "revista" : str(processo) }) :
        return True
    return False
