//creating a random database for tata group 

let Categories = [
    {
        categoryID: "tata",
        name: "tata_group",
        totalTargetSales: 3000000,
        currentSales: 1000000,
        level: 0,
        progressPercentage: 33,
        colorCode: "red",
        label: "At Risk",
        parentID: "null",
        childID: ["factory1", "factory2", "factory3"],
    },
    {
        categoryID: "factory1",
        name: "factory",
        totalTargetSales: 1000000,
        currentSales: 500000,
        level: 1,
        progressPercentage: 50,
        colorCode: "yellow",
        label: "off track",
        parentID: "tata",
        childID: ["godown11", "godown12"],
    },
    {
        categoryID: "factory2",
        name: "factory",
        totalTargetSales: 1000000,
        currentSales: 300000,
        level: 1,
        progressPercentage: 30,
        colorCode: "red",
        label: "At Risk",
        parentID: "tata",
        childID: ["godown21", "godown22"],
    },
    {
        categoryID: "factory3",
        name: "factory",
        totalTargetSales: 1000000,
        currentSales: 200000,
        level: 1,
        progressPercentage: 20,
        colorCode: "red",
        label: "At Risk",
        parentID: "tata",
        childID: ["godown31", "godown32"],
    },
];

module.exports = { Categories };