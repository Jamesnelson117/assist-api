// Mock requests
let requests = [
  {
    "_id": "59316b89008c586bc2214001",
    title: 'Need new gmail account',
    message: 'Please give me a new gmail account mine has broke',
    priority: 'Medium',
    assignee: "59316b89008c586bc2214319",
    author: "59316b89008c586bc2214318",
    comments: [
      {
        author: "59316b89008c586bc2214318",
        message: "When does this need done by?"
      },
      {
        author: "59316b89008c586bc2214319",
        message: "Not untill tuesday"
      },
    ],
    dateCreated: 1561203118555
  },
  {
    "_id": "59316b89008c586bc2214002",
    title: 'New Macbook',
    message: 'Need a Macbook Pro rather than a PC',
    priority: 'Low',
    assignee: "59316b89008c586bc2214319",
    author: "59316b89008c586bc2214319",
    dateCreated: 1561203235299
  },
  {
    "_id": "59316b89008c586bc2214003",
    title: 'Something happened to my CPU',
    message: 'My machine wont start. Help!',
    priority: 'High',
    assignee: "59316b89008c586bc2214319",
    author: "59316b89008c586bc2214319",
    dateCreated: 1561203245934
  },
];

module.exports = requests;