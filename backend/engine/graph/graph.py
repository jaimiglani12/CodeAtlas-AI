class ChunkGenerator:

    def __init__(self, index):

        self.index = index
    
    def add_dependency(
                self,
                caller,
                callee
            ):
                if caller not in self.graph:

                    self.graph[caller] = []

                self.graph[caller].append(callee)
    
    def print_graph(self):

            for caller in self.graph:

                print(caller)

                for callee in self.graph[caller]:

                    print("   ↓")

                    print("   ", callee)

                print()
                
    