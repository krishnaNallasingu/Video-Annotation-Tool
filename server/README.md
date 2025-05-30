# Video-Annotation-Tool
a web-based video annotation tool that allows users to watch videos and add timestamped annotations.


# API - End Points:
- GET all annotations:
'''
curl http://localhost:5001/api/annotations
'''
- POST a new annotation: '''
curl -X POST http://localhost:5001/api/annotations \
  -H "Content-Type: application/json" \
  -d '{"type":"circle","timestamp":10,"x":100,"y":100,"color":"#ff0000"}' 
  '''

- PUT (update) an annotation:
'''
curl -X PUT http://localhost:5001/api/annotations/<id> \
  -H "Content-Type: application/json" \
  -d '{"color":"#00ff00"}'
'''

- DELETE an annotation:
'''
curl -X DELETE http://localhost:5001/api/annotations/<id>
'''