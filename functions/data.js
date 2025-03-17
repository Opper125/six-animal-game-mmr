let gameData = {
    round: 0,
    status: 'stopped',
    winners: [],
    playersOnline: 0,
    balances: {},
    bets: {},
    totalWon: {},
    stats: {
        crab: 0,
        fish: 0,
        gourd: 0,
        rooster: 0,
        tiger: 0,
        prawn: 0
    },
    totalRolls: 0,
    lastUpdated: Date.now()
};

exports.handler = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const { action, userId, amount, animal, round, winners, stats, totalRolls } = body;

    // Auto-increment round every 20 seconds if game is running
    if (gameData.status === 'running' && Date.now() - gameData.lastUpdated >= 20000) {
        gameData.round++;
        gameData.winners = [];
        gameData.lastUpdated = Date.now();
    }

    switch (action) {
        case 'getGameData':
            if (!gameData.playersOnline) gameData.playersOnline = 0;
            gameData.playersOnline = Math.max(gameData.playersOnline, 1);
            return { statusCode: 200, body: JSON.stringify(gameData) };
        case 'startGame':
            gameData.status = 'running';
            gameData.round = round;
            gameData.lastUpdated = Date.now();
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'stopGame':
            gameData.status = 'stopped';
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'setWinners':
            gameData.winners = winners.slice(0, 3); // Limit to 3 animals
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
        case 'updateBalance':
            gameData.balances[userId] = (gameData.balances[userId] || 0) + amount;
            gameData.totalWon[userId] = (gameData.totalWon[userId] || 0) + amount;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        case 'updateStats':
            gameData.stats = stats;
            gameData.totalRolls = totalRolls;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        default:
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
    }
};
