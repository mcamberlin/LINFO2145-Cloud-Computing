import pytest


def pytest_addoption(parser):
    parser.addoption("--ip", action="store", default="localhost", required=True,help="IP address of the server")



@pytest.fixture
def ip(request):
    return request.config.getoption("--ip")