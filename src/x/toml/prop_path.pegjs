start = id (arr_access / prop_access)*
id = x: [a-zA-Z]+ {return x.join("")}
arr_access = '[' x: integer ']' { return parseInt(x)}
prop_access = '.' id: id { return id }
integer = [0-9]+