let gameData = {
    round: 0,
    status: 'stopped',
    winners: [],
    playersOnline: 0,
    balances: {},
    bets: {},
    totalWon: {}
};

exports.handler = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const { action, userId, amount, animal, round, winners } = body;

    switch (action) {
        case 'getGameData':
            gameData.playersOnline += 1; // Increment player count
            return { statusCode: 200, body: JSON.stringify(gameData) };
        case 'startGame':
            gameData.status = 'running';
            gameData.round = round;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'stopGame':
            gameData.status = 'stopped';
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'setWinners':
            gameData.winners = winners;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'placeBet':
            gameData.bets[userId] = gameData.bets[userId] || {};
            gameData.bets[userId][round] = gameData.bets[userId][round] || {};
            gameData.bets[userId][round][animal] = (gameData.bets[userId][round][animal] || 0) + amount;
            gameData.balances[userId] = (gameData.balances[userId] || 0) - amount;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'getWinners':
            return { statusCode: 200, body: JSON.stringify({ winners: gameData.winners }) };
        case 'deposit':
            gameData.balances[userId] = (gameData.balances[userId] || 0) + amount;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'withdraw':
            gameData.balances[userId] = (gameData.balances[userId] || 0) - amount;
            if (gameData.balances[userId] < 0) gameData.balances[userId] = 0;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'getPlayerData':
            const totalBet = Object.values(gameData.bets[userId] || {}).reduce((sum, round) => sum + Object.values(round).reduce((s, a) => s + a, 0), 0);
            const totalWon = gameData.totalWon[userId] || 0;
            return { 
                statusCode: 200, 
                body: JSON.stringify({ 
                    balance: gameData.balances[userId] || 0, 
                    totalBet, 
                    totalWon, 
                    round: gameData.round 
                }) 
            };
        default:
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
    }
};
