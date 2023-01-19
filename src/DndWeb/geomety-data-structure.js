// todo: geometry.map(r=>d3.polygonCentroid(r.vertices)) // draw some points or some thing

const drawBoundingBox = (room) => {
    const x = d3.extent(room.vertices.map(v => v[0]));
    const y = d3.extent(room.vertices.map(v => v[1]));
    geometryEdit.append('rect')
        .attr('x', x[0]).attr('y', y[0])
        .attr('width', x[1] - x[0]).attr('height', y[1] - y[0])
        .style('stroke', 'blue')
        .style('fill', 'none')
        .style('shape-rendering', 'crispEdges');
}

// geometry.forEach(drawBoundingBox);

const drawBisectors = (x, y, width, height, depth) => {

    geometryEdit.append('line')
        .attr('x1', x + width / 2)
        .attr('y1', y)
        .attr('x2', x + width / 2)
        .attr('y2', y + height)
        .style('stroke', 'red')
        .style('stroke-width', depth + 1)
        .style('shape-rendering', 'crispEdges');

    geometryEdit.append('line')
        .attr('x1', x)
        .attr('y1', y + height / 2)
        .attr('x2', x + width)
        .attr('y2', y + height / 2)
        .style('stroke', 'red')
        .style('stroke-width', depth + 1)
        .style('shape-rendering', 'crispEdges');

};

// tood: also try getting x, y, w, h from min-max of contained rooms (more ballanced?)
// or use like averaged bounding-box centers to make partitioning boundaries

const drawQuadtree = (x, y, width, height, depth = 0) => {

    drawBisectors(x, y, width, height, depth);

    if (depth === 0) { return; }

    drawQuadtree(x, y, width / 2, height / 2, depth - 1);
    drawQuadtree(x + width / 2, y, width / 2, height / 2, depth - 1);
    drawQuadtree(x + width / 2, y + height / 2, width / 2, height / 2, depth - 1);
    drawQuadtree(x, y + height / 2, width / 2, height / 2, depth - 1);

}

// drawQuadtree(0, 0, svg.attr('width'), svg.attr('height'), 4);

// todo: find out what depth of quad tree gives the best "entropy"
// try: push sub-trees until you get "the same result"
// that is, each sibling contains the same set of rooms

///////////////////////////////////////////////////////////////////////////////

const getRoomExtents = (room) => ({
    x: d3.extent(room.vertices.map(v => v[0])),
    y: d3.extent(room.vertices.map(v => v[1]))
})

const getQuadrants = (extents) => { // {x:[x1,x2], y:[y1,y2]}
    const { x, y } = extents
    const [x1, x2] = x
    const [y1, y2] = y
    return [
        { x: [x1, x2 / 2], y: [y1, y2 / 2] }, // NW
        { x: [x2 / 2, x2], y: [y1, y2 / 2] }, // NE
        { x: [x2 / 2, x2], y: [y2 / 2, y2] }, // SE
        { x: [x1, x2 / 2], y: [y2 / 2, y2] } // SW
    ]
}

const pointInRect = (p, extents) => // [x,y], {x:[x1,x2], y:[y1,y2]}
    p[0] >= extents.x[0] &&
    p[0] <= extents.x[1] &&
    p[1] >= extents.y[0] &&
    p[1] <= extents.y[1]

const boxesOverlap = (a, b) => // {x:[x1,x2], y:[y1,y2]}, {x:[x1,x2], y:[y1,y2]}
    a.x[0] <= b.x[1] &&
    a.x[1] >= b.x[0] &&
    a.y[0] <= b.y[1] &&
    a.y[1] >= b.y[0]


const getRooms = (x, y, tree) => {
    if(!pointInRect([x, y], tree.extents)) {
        return
    }
    if(tree.branches) {
        return getRooms(x, y, getBranch(x, y, tree));
    }
    return tree.leaves
        .filter(leaf => d3.polygonContains(leaf.geometry.vertices, [x, y]))
        .map(leaf => leaf.geometry)
}

const getBranch = (x, y, tree) =>
    tree.branches.filter(b => pointInRect([x, y], b.extents))[0]

// todo (wip)
const createBranches = (leaves, extents) => {
    const quadrants = getQuadrants(extents)
    const [NW, NE, SE, SW] = quadrants
    return [
        newBranch(leaves.filter(l => boxesOverlap(l.extents, NW)), NW),
        newBranch(leaves.filter(l => boxesOverlap(l.extents, NE)), NE),
        newBranch(leaves.filter(l => boxesOverlap(l.extents, SE)), SE),
        newBranch(leaves.filter(l => boxesOverlap(l.extents, SW)), SW)
    ]
}

const newBranch = (pLeaves, pExtents) => {

    return {
        leaves: pLeaves,
        extents: pExtents
    }

}

const newQuadTree = (pGeometry) => {

    const leaves = pGeometry.map(g => ({
        geometry: g,
        extents: getRoomExtents(g)
    }))

    const extents = {
        x: d3.extent(leaves.map(r => r.extents.x).reduce((a, b) => a.concat(b))),
        y: d3.extent(leaves.map(r => r.extents.y).reduce((a, b) => a.concat(b)))
    }

    return {
        leaves,
        extents
    }

}

const tree = newQuadTree(geometry)

// tree.branches = createBranches(tree.leaves, tree.extents)
// tree.branches.forEach(b => {
//     b.branches = createBranches(b.leaves, b.extents)
//     b.leaves = null
// })

// let [x1, x2] = tree.extents.x
// let [y1, y2] = tree.extents.y

// drawQuadtree(x1, y1, x2 - x1, y2 - y1, 4)

d3.select('svg').on('click', () => {
    console.time('getRooms')
    console.log(getRooms(d3.event.pageX, d3.event.pageY, tree));
    console.timeEnd('getRooms')
});