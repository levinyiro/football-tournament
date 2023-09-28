# football-tournament

## user story
First of all, I initialize the data of tournament. I decide how much groups there will be, and how many person can be in the knockout (2, 4, 8, 16). There will be Team1, Team2, etc... and I can rename all of that. In every tournament I have to add players (so the name won't be unique in tournament table). This step will generate the matches. A match will have scores. At the end of the matches of a group the program will choose the for example two best player into a knock match. This step will generate the first knockmatches (group A first vs. group B second and group A second vs. group B first).

If a player win a knockout match, there will be generated a new knockout match with a round and a matchnumber.

Here's an example structure for a tournament with 4 knockout matches, including semifinals, finals, and a bronze match:

- Round 1: Semifinals
    - Match 1: Semifinal 1
    - Match 2: Semifinal 2
- Round 2: Bronze Match
    - Match 3: Bronze Match
- Round 3: Finals
    - Match 4: Final

A match is always generated automatically. If we delete a player from a group, or we repair or remove score in a match, then the next match will be modified or deleted.

## er-diagram
![image](https://github.com/Trophien/football-tournament/assets/44240562/8cfe36f1-c41f-41a3-8e89-ca6bec4e0490)

## projected endpoints
- /tournament - GET, POST, PUT, DELETE (if there aren't any done matches yet)
    - username and password is basic and protected by JWT
- /group - GET (must includes players data, and matches too), POST
- /group/:id - GET (must includes matches), PUT, DELETE
- /player - PUT (if there aren't any done matches yet)
- /match/:id - PUT (in body I can modify just scoreA and scoreB, and I can modify Match and knockout too)

## references
https://github.com/leventenyiro/poll it can be a good reference for using nodejs

## some note for me
1 group 2 totalPromoted - { (A1, A2) }
1 group 4 totalPromoted - { (A1, A3), (A2, A4) }
2 group 2 totalPromoted - { (A1, B1) }
2 group 4 totalPromoted - { (A1, B2), (A2, B1) }
3 group 2 totalPromoted - { (Mod 1, Mod 2) }
3 group 4 totalPromoted - { (A1, C1), (B2, Mod1) }
4 group 2 totalPromoted - { (Mod 1, Mod 2) }
4 group 4 totalPromoted - { (A1, C1), (B1, D1)}
