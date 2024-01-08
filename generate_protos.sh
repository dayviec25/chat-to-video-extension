#!/bin/bash

PROTO_DIR="./proto"
PY_OUT_DIR="./python-service"

# Generate Python code
python3 -m grpc_tools.protoc -I$PROTO_DIR --python_out=$PY_OUT_DIR --grpc_python_out=$PY_OUT_DIR $PROTO_DIR/video_service.proto
python3 -m grpc_tools.protoc -I$PROTO_DIR --python_out=$PY_OUT_DIR --grpc_python_out=$PY_OUT_DIR $PROTO_DIR/chatbot.proto

echo "gRPC code generated for Go and Python."
