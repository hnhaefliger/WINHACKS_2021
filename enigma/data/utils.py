import uuid

def createUUID():
    '''
    Generate a id that can be openly used to make indexing more difficult.
    '''
    return uuid.uuid4().hex