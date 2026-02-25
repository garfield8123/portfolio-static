import json

def load_json(filename):
    with open(filename) as fileinfo:
        return json.load(fileinfo)

def search(SearchBox):
    searchList = json.load(projectile)
    queredList = []
    #---- Finds similiar name or tags for search box ----
    for x in searchList.get("Projects"):
        if SearchBox.lower() in x.get("Name").lower():
            queredList.append(x)
        elif SearchBox.lower() in [y.lower() for y in x.get("tag")]:
            queredList.append(x)
        elif SearchBox.lower() in x.get("information"):
         _f   queredList.append(x)
        else:
            continue
    return queredList

def makeprettytags(Project):
    siteTemplate = load_json(Site_template_file)
    tagstyle = siteTemplate.get("Tag")
    tagStylestart = siteTemplate.get("Tag start")
    tagStyleend = siteTemplate.get("Tag end")
    taglist = Project.get("tag")
    result = tagStylestart
    for x in taglist:
        result = result + tagstyle.replace("%name", x)
    result = result + tagStyleend
    return result

def makeitpretty(searchList):
    print(searchList)
    siteTemplate = load_json(Site_template_file)
    result = ""
    if len(searchList) %3 == 0:
        number_of_div = len(searchList) // 3 
        #print("equal to 3 ")
    else:
        number_of_div = len(searchList) // 3
    split_searchList = [searchList[i:i+3] for i in range(0, len(searchList), 3)]
    
    while number_of_div > 0: 
        for x in split_searchList:
            
            result = result + siteTemplate.get("Project start")
            #print("x", x)
            if len(x) == 3:
                for y in x:
                    projectstyle = siteTemplate.get("Project")
                    projectstyle = projectstyle.replace("%tag", makeprettytags(y))
                    projectstyle = projectstyle.replace('%title', y.get("Name"))
                    projectstyle = projectstyle.replace('%info', y.get("information"))
                    projectstyle = projectstyle.replace('%link', y.get("Link"))
                    result = result + projectstyle
                split_searchList.remove(x)
            result = result + siteTemplate.get("Project end")
        # create div 
        number_of_div -= 1
    if number_of_div == 0:
        for x in split_searchList:
            if len(x) != 3:
                result = result + siteTemplate.get("Project start")
                for y in x: 
                    projectstyle = siteTemplate.get("Project")
                    projectstyle = projectstyle.replace('%tag', makeprettytags(y))
                    projectstyle = projectstyle.replace('%title', y.get("Name"))
                    projectstyle = projectstyle.replace('%info', y.get("information"))
                    projectstyle = projectstyle.replace('%link', y.get("Link"))
                    result = result + projectstyle
                result = result + siteTemplate.get("Project end")
    return result

import sys
import os
if __name__ == "__main__":
    Site_template_file = os.path.abspath(sys.argv[1])
    project_file = os.path.abspath(sys.argv[2])
    result = makeitpretty(load_json(project_file).get("Projects"))
    with open("html.txt", "w") as text_file:
        text_file.write(result)
    