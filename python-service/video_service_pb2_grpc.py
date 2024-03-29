# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import video_service_pb2 as video__service__pb2


class VideoServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.CheckVideo = channel.unary_unary(
                '/main.VideoService/CheckVideo',
                request_serializer=video__service__pb2.VideoRequest.SerializeToString,
                response_deserializer=video__service__pb2.VideoResponse.FromString,
                )


class VideoServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def CheckVideo(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_VideoServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'CheckVideo': grpc.unary_unary_rpc_method_handler(
                    servicer.CheckVideo,
                    request_deserializer=video__service__pb2.VideoRequest.FromString,
                    response_serializer=video__service__pb2.VideoResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'main.VideoService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class VideoService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def CheckVideo(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/main.VideoService/CheckVideo',
            video__service__pb2.VideoRequest.SerializeToString,
            video__service__pb2.VideoResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
