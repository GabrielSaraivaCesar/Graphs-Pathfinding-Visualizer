# Graphs-Pathfinding-Visualizer
This repository was made for study purposes. Feel free to test it, make suggestions, create PRs or even use it for study as well 😁

## Features
### Interactive Canvas
The software draws the graphs in a HTML5 canvas, you can play with it by zooming in and out or dragging the content in the X and Y axis for a better visualization

### Dynamic Graphs Generation
For building the graphs I used the concept of the wave collapse function algorithm. The input for it is the size of the matrix that will be generated. So for a 2x2 matrix, the algorithm will generate up to 4 vertices

### Visualizable Algorithms
#### Shortest Path
This algorithm was implemented using dijkstra algorithm to find the best pathing options, after running dijkstra you can simply run backwards starting from
the destination vertex and getting the best path until the start vertex.

![Captura de tela de 2022-05-15 03-05-37](https://user-images.githubusercontent.com/43767905/168459517-6abbde12-2219-47e4-aaf6-548a7d22ac43.png)
<br>*The UI may change in the future

#### Bridges Detector
The bridge detector works by iterating through all the edges, running a DFS algorithm starting from any of its vertices, then removing the edge from the graph and running the DFS algorithm again.
If the outputs of the 2 DFS are different, the current edge is a bridge 

![Captura de tela de 2022-05-15 03-14-08](https://user-images.githubusercontent.com/43767905/168459771-6a5be02c-944d-4956-97da-03fb1f30d0be.png)
