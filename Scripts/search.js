var script = document.createElement("script");
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js";
script.type = "text/javascript";
//document.getElementsByTagName("head")[0].appendChild(script1);
document.getElementsByTagName("head")[0].appendChild(script);

let projectlist;

async function loadProjects() {
    const data = await $.getJSON('../information/Projects.json');
    projectlist = data.Projects;
    //console.log("Projects loaded:", projectlist);
}

loadProjects();  // starts loading

let siteTemplate;

async function loadSiteTemplate() {
    const data = await $.getJSON('../information/site-template.json');
    siteTemplate = data;
    //console.log("site loaded:", siteTemplate);
}

loadSiteTemplate();  // starts loading


function search(SearchBox) {
    const searchList = projectlist;
    //console.log(searchList)
    const queredList = [];
    //---- Finds similar name or tags for search box ----
    for (const x of searchList) {
        if (x.Name.toLowerCase().includes(SearchBox.toLowerCase())) {
            queredList.push(x);
        } else if (x.tag.some(y => y.toLowerCase() === SearchBox.toLowerCase())) {
            queredList.push(x);
        } else if (x.information && x.information.includes(SearchBox)) {
            queredList.push(x);
        }
    }
    return queredList;
}

function makeprettytags(Project) {
    //const siteTemplate = load_json(Site_template_file);
    const tagstyle = siteTemplate["Tag"];
    const tagStylestart = siteTemplate["Tag start"];
    const tagStyleend = siteTemplate["Tag end"];
    const taglist = Project["tag"];
    let result = tagStylestart;
    for (const x of taglist) {
        //console.log(x)
        result += tagstyle.replaceAll("%name", x);
    }
    result += tagStyleend;
    //console.log(tagstyle)
    //console.log("result",result)
    return result;
}


function makeitpretty(searchList) {
    //console.log("hello",searchList);
    //const siteTemplate = load_json(Site_template_file);
    let result = "";
    let number_of_div;
    if (searchList.length % 3 === 0) {
        number_of_div = Math.floor(searchList.length / 3);
        //console.log("equal to 3 ");
    } else {
        number_of_div = Math.floor(searchList.length / 3);
    }
    let split_searchList = [];
    for (let i = 0; i < searchList.length; i += 3) {
        split_searchList.push(searchList.slice(i, i + 3));
    }

    while (number_of_div > 0) {
        for (let i = 0; i < split_searchList.length; i++) {
            let x = split_searchList[i];
            result += siteTemplate["Project start"];
            //console.log("x", x);
            if (x.length === 3) {
                for (let y of x) {
                    let projectstyle = siteTemplate["Project"];
                    //console.log("hello", y)
                    //console.log("name", y["Name"])
                    //console.log("here",makeprettytags(y))
                    projectstyle = projectstyle.replace("%tag", makeprettytags(y));
                    projectstyle = projectstyle.replaceAll('%title', y["Name"]);
                    projectstyle = projectstyle.replace('%info', y["information"]);
                    projectstyle = projectstyle.replace('%link', y["Link"]);
                    result += projectstyle;
                }
                split_searchList.splice(i, 1);
                i--; // adjust index after removal
            }
            result += siteTemplate["Project end"];
        }
        number_of_div -= 1;
    }
    if (number_of_div === 0) {
        for (let x of split_searchList) {
            if (x.length !== 3) {
                result += siteTemplate["Project start"];
                for (let y of x) {
                    let projectstyle = siteTemplate["Project"];
                    //console.log("here",makeprettytags(y))
                    projectstyle = projectstyle.replace('%tag', makeprettytags(y));
                    projectstyle = projectstyle.replaceAll('%title', y["Name"]);
                    projectstyle = projectstyle.replace('%info', y["information"]);
                    projectstyle = projectstyle.replace('%link', y["Link"]);
                    result += projectstyle;
                }
                result += siteTemplate["Project end"];
            }
        }
    }
    return result;
}

// Run on page 
/*
async function init() {
    await loadProjects();          // wait until projects are loaded
    await loadSiteTemplate();      // safe to use global projectlist
    const projectContent = document.querySelector(".ProjectList");
    const projecthtmlcontent = makeitpretty(projectlist);
    projectContent.innerHTML = projecthtmlcontent;
}

init(); // triggers when page loads

// Triggered when form is submitted
async function handlesearch(event) {
    event.preventDefault();        // Prevent the default form submission
    await loadProjects();          // ensure projects are loaded
    await loadSiteTemplate();      // safe to use global projectlist

    const inputValue = document.getElementById('searchInput').value;
    console.log("Search value:", inputValue);
    console.log(projectlist)
    // Filter or search your projectlist (assuming you have a function for that)
    const filteredProjects = search(inputValue); // use your actual search logic

    const projectContent = document.querySelector(".ProjectList");
    const projecthtmlcontent = makeitpretty(filteredProjects);
    projectContent.innerHTML = projecthtmlcontent;
}

// Attach event listener to the form
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('searchForm').addEventListener('submit', handlesearch);
});
//class ProjectList*/
async function init() {
    await loadProjects();
    await loadSiteTemplate();

    const projectContent = document.querySelector(".ProjectList");

    // Check if we are on project.html
    const currentPage = window.location.pathname.split("/").pop(); // gets "project.html"
    if (currentPage === "project.html") {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get("search");

        let projectsToShow = projectlist;

        if (searchQuery) {
            projectsToShow = search(searchQuery);
            document.getElementById('searchInput').value = searchQuery; // fill input with query
        }

        projectContent.innerHTML = makeitpretty(projectsToShow);
    }
}

init();

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // prevent default submit
        const query = document.getElementById('searchInput').value;

        // If already on project.html, just run the search
        if (window.location.pathname.endsWith("project.html")) {
            //console.log("project")
            handleSearchOnProjectPage(query);
        } else {
            // Redirect to project.html with query parameter
            //console.log("nonproject")
            window.location.href = `./project.html?search=${encodeURIComponent(query)}`;
        }
    });
});

function handleSearchOnProjectPage(query) {
    const projectContent = document.querySelector(".ProjectList");
    if (!projectContent) return; // <--- exit if .ProjectList doesn't exist

    const filteredProjects = search(query);
    projectContent.innerHTML = makeitpretty(filteredProjects);
}

