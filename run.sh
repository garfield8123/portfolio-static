#----- HTML Layout -----
index="HTML/index.tpl"
aboutMe="HTML/about-me.tpl"
Project="HTML/project.tpl"

#----- HTML Copy -----
indexHTML="index.html"
aboutMeHTML="about-me.html"
ProjectHTML="project.html"

#----- Files layout -----
aboutmefile="information/about-me.json"
projectfile="information/Projects.json"
sitetemplatefile="information/site-template.json"

#----- Copy HTML Files -----
cp $index $indexHTML
cp $aboutMe $aboutMeHTML
cp $Project $ProjectHTML

#----- File Variable -----
aboutmeinfo=$(cat $aboutmefile)
projectinfo=$(cat $projectfile)
sitetemplateinfo=$(cat $sitetemplatefile)

function findinfo(){
    echo "$1" | grep -i "$2" | cut -d ":" -f 2- | tr '"' ' ' | tr ',' ' '
}

#----- load content variables -----
fullname=$(findinfo "$aboutmeinfo" "name")
firstname=$(echo $fullname | cut -d " " -f 1)
Positiontitle=$(findinfo "$aboutmeinfo" "PositionTitle")
Email=$(findinfo "$aboutmeinfo" "email")
githublink=$(findinfo "$aboutmeinfo" "Github")
majorname=$(findinfo "$aboutmeinfo" "Major")
schoolname=$(findinfo "$aboutmeinfo" "School")
echo $Email

function changeHTML(){
    sed -i "s|${1}|${2}|g" "$3"
}

#----- Change html file -----
changeHTML "{{githubLink}}" "$githublink" "$indexHTML"
changeHTML "{{email}}" "$Email" "$indexHTML"
changeHTML "{{firstName}}" "$firstname" "$indexHTML"

changeHTML "{{githubLink}}" "$githublink" "$aboutMeHTML"
changeHTML "{{email}}" "$Email" "$aboutMeHTML"
changeHTML "{{firstName}}" "$firstname" "$aboutMeHTML"

changeHTML "{{githubLink}}" "$githublink" "$ProjectHTML"
changeHTML "{{email}}" "$Email" "$ProjectHTML"
changeHTML "{{firstName}}" "$firstname" "$ProjectHTML"

#----- Changes to Index html ----
changeHTML "{{fullName}}" "$fullname" "$indexHTML"
changeHTML "{{positionTitle}}" "$Positiontitle" "$indexHTML"


function lookthroughjson(){
    local htmlstring=""
    printf '%s\n' "$2" | 
    sed -n "/\"$1\"[[:space:]]*:/,/^[[:space:]]*}/p" | 
    sed '1d;$d;s/^[[:space:]]*//;s/,$//' | 
    while IFS=: read -r key value; do        
        htmlstring+=$(echo "$sitetemplateinfo" | grep -i -A1 "$3" | tail -n 1 | tr '"' ' ' | tr ',' ' ')
        echo "$htmlstring" > html.txt
        key=${key//\"/}
        value=${value#\"}
        value=${value%\"}
        changeHTML "%name" "$key" "html.txt"
        changeHTML "%expire" "$value" "html.txt"
    done 
}

#----- Changes to About-me html ----
changeHTML "{{schoolName}}" "$schoolname" "$aboutMeHTML"
changeHTML "{{majorName}}" "$majorname" "$aboutMeHTML"
changeHTML "{{fullName}}" "$fullname" "$aboutMeHTML"
lookthroughjson "Certifications" "$aboutmeinfo" "Certifications"
changeHTML "{{!certifications}}" "$(cat html.txt)" "$aboutMeHTML"
lookthroughjson "Skills" "$aboutmeinfo" "Skills"
changeHTML "{{!skills}}" "$(cat html.txt)" "$aboutMeHTML"


#----- Changes to Project html -----
rm html.txt
python search.py $sitetemplatefile $projectfile
changeHTML "{{!ProjectList}}" "$(cat html.txt)" "$ProjectHTML"
