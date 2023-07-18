# football-tournament

## user story
I have an empty league. I add 2 hats - strong and weak players. In a hat I will add 4-4 players. I will raffle into two groups (A and B). In a group there will be two strong and two weak player. This step will generate the matches. A match will have scores and there will be 6 match in that case in a group. At the end of the matches of a group the programme will choose the two best player into a knock match. This step will generate the first knockmatches (group A first vs. group B second and group A second vs. group B first).

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
![er-diagram](https://github.com/Trophien/football-tournament/assets/44240562/43f3ed81-e524-45a2-84ec-c8c00f2ced79)

## projected endpoints
- /tournament - GET, POST, PUT, DELETE (if there aren't any done matches yet)
    - username and password is basic and protected by JWT
- /hat - GET (must includes players data), POST
- /hat/:id - PUT, DELETE
- /group - GET (must includes players data, and matches too), POST
- /group/:id - GET (must includes matches), PUT, DELETE
- /player - POST, PUT, DELETE (if there aren't any done matches yet)
- /raffle - POST (just raffle into groups, if there aren't any done matches yet)
- /match/:id - PUT (in body I can modify just scoreA and scoreB, and I can modify Match and knockout too)

## references
https://github.com/leventenyiro/poll it can be a good reference for using nodejs