from ultralytics import YOLO
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import json
import logging


class ClassificationHandler(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

    def do_GET(self):
        url = urlparse(self.path)
        query_params = parse_qs(url.query)
        logging.info("Classifying image: ", query_params)
        self._set_response()
        results = model("/pixil-media/" + str(query_params.get("filename"))[2:-2])
        labels = set()
        for r in results:
            for t in r.summary():
                labels.add(t["name"])
        response_data = {"labels": list(labels)}
        response_json = json.dumps(response_data)

        self.wfile.write(response_json.encode("utf-8"))


def run(server_class=HTTPServer, handler_class=ClassificationHandler, port=5000):
    logging.basicConfig(level=logging.INFO)
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    logging.info("Starting classification server...\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info("Stopping classification server...\n")


if __name__ == "__main__":
    from sys import argv

    # Load a pretrained YOLO model
    model = YOLO("yolo11n.pt")
    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
