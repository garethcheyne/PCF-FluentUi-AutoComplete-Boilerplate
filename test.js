// Define HN namespace 
var HN = HN || {};

HN.something = {
    getUsers: (owner) => {
        Xrm.WebApi.retrieveMultipleRecords("systemuser", "?$filter=(name eq " + owner + ")").then(
            function success(results) {
                return results;
            },
            function (error) {
                console.error(error.message);
            });
    }
}

console.log(HN.something.getUsers('Gareth'));

























HN.something = {
    getUsers: async (owner) => {
        let res = await Xrm.WebApi.retrieveMultipleRecords("systemuser", "?$filter=(name eq " + owner + ")")
        return res[0];
    }
}

var res = await HN.something.getUsers('Gareth');
console.log(res);