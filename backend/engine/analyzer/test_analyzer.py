from pprint import pprint

from engine.builder.builder import RepositoryBuilder
from engine.analyzer.repository_analyzer import RepositoryAnalyzer


builder = RepositoryBuilder()

index = builder.build("../")

analyzer = RepositoryAnalyzer(index)

pprint(analyzer.summary())