import grpc

from app.grpc_config import face_restoration_pb2, face_restoration_pb2_grpc


class GrpcClient:
    @staticmethod
    def get_face_restoration_from_grpc(
        endpoint: str,
        image: bytes,
        background_enhance: bool = False,
        face_upsample: bool = True,
        upscale: int = 2,
        codeformer_fidelity: float = 0.7,
        timeout: int = 60,
    ):
        return GrpcClient.face_restoration(
            endpoint=endpoint,
            image=image,
            background_enhance=background_enhance,
            face_upsample=face_upsample,
            upscale=upscale,
            codeformer_fidelity=codeformer_fidelity,
            timeout=timeout,
        )

    @staticmethod
    def face_restoration(
        endpoint: str,
        image: bytes,
        background_enhance: bool = False,
        face_upsample: bool = True,
        upscale: int = 2,
        codeformer_fidelity: float = 0.7,
        timeout: int = 60,
    ):
        """Apply face restoration on image face

        Arguments:
            endpoint (str): Server endpoint
            image: The image to apply face restoration
            timeout (int): Maximum seconds to process an image
        """
        channel = grpc.insecure_channel(
            endpoint,
            options=[
                ("grpc.max_send_message_length", -1),
                ("grpc.max_receive_message_length", -1),
                ("grpc.so_reuseport", 1),
                ("grpc.use_local_subchannel_pool", 1),
            ],
        )
        stub = face_restoration_pb2_grpc.FaceRestorationServiceStub(channel)

        response = stub.ApplyFaceRestoration(
            face_restoration_pb2.FaceRestorationRequest(
                image=image,
                background_enhance=background_enhance,
                face_upsample=face_upsample,
                upscale=upscale,
                codeformer_fidelity=codeformer_fidelity,
            ),
            timeout=timeout,
        )
        return response.restored_image
