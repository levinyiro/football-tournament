class Data {
    static async getTournaments() {
        try {
            const response = await fetch('https://car-racing-tournament-api.azurewebsites.net/api/season');
            const data = await response.json();
            this.fetchedTournaments = data;
            return this.fetchedTournaments;
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            return [];
        }
    }

    static updateTournaments(modifiedData) {
        this.tournaments = modifiedData;
    }
}

export default Data;
