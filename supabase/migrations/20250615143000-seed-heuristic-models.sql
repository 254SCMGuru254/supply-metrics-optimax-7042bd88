INSERT INTO model_formulas (user_id, name, formula, description, category, inputs)
VALUES
    (
        'your-user-id',
        'Simulated Annealing',
        'simulated-annealing',
        'Metaheuristic for combinatorial optimization problems.',
        'heuristic',
        '[{"label": "Initial Temperature", "name": "initialTemp", "type": "number"}, {"label": "Cooling Rate", "name": "coolingRate", "type": "number"}]'
    ),
    (
        'your-user-id',
        'Genetic Algorithm',
        'genetic-algorithm',
        'Evolutionary search algorithm using crossover/mutation.',
        'heuristic',
        '[{"label": "Population Size", "name": "populationSize", "type": "number"}, {"label": "Generations", "name": "generations", "type": "number"}]'
    ),
    (
        'your-user-id',
        'Particle Swarm Optimization',
        'particle-swarm',
        'Swarm-based optimization using velocity/social learning.',
        'heuristic',
        '[{"label": "Number of Particles", "name": "numParticles", "type": "number"}, {"label": "Iterations", "name": "iterations", "type": "number"}]'
    ),
    (
        'your-user-id',
        'Tabu Search',
        'tabu-search',
        'Improvement algorithm to escape local optima.',
        'heuristic',
        '[{"label": "Tabu List Size", "name": "tabuListSize", "type": "number"}, {"label": "Max Iterations", "name": "maxIterations", "type": "number"}]'
    ); 