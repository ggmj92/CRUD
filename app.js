const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let characters = [
    { id: 1, name: 'Ryu', age: 32, origin: 'Japan' },
    { id: 2, name: 'Chun-Li', age: 29, origin: 'China' },
    { id: 3, name: 'Guile', age: 35, origin: 'United States' },
    { id: 4, name: 'Dhalsim', age: 45, origin: 'India' },
    { id: 5, name: 'Blanka', age: 32, origin: 'Brazil' },
];

//READ
app.get('/', (req, res) => {
    res.send(`
    <nav>
    <a href="/characters">Edit Characters</a>
    </nav>
    <h1>Welcome</h1>
    <ul>
    ${characters
            .map((characters) => `<li>Id: ${characters.id} | Name: ${characters.name} | Age: ${characters.age} | Place of Origin: ${characters.origin}
    </li>`)
            .join('')}
    </ul>
    <a href="/characters">Characters JSON</a>
    `)
});

//CREATE
app.get('/characters', (req, res) => {
    res.send(`
    <nav>
    <a href="/">Home</a>
    </nav>
    <h1>Character List</h1>
    <ul>
    ${characters
            .map((characters) => `<li>Id: ${characters.id} | Name: ${characters.name} | Age: ${characters.age} | Place of Origin: ${characters.origin} <button onclick="window.location.href='/characters/${characters.name}'">View</button>
    </li>`)
            .join('')}
    </ul>
    <form action="/characters" method="post">
    <h2>Add New Character</h2>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="age">Age:</label>
    <input type="number" id="age" name="age" required>
    <label for="origin">Place of Origin:</label>
    <input type="text" id="origin" name="origin" required>
    <button type="submit">Add</button>
    </form>
    `)
});

app.post('/characters', (req, res) => {
    const newCharacter = {
        id: characters.length + 1,
        name: req.body.name,
        age: req.body.age,
        origin: req.body.origin,
    };
    characters.push(newCharacter);
    res.redirect('/');
});

app.get('/characters/:name', (req, res) => {
    const character = characters.find(u => u.name === req.params.name);
    if (character) {
        res.send(`
        <nav>
            <a href="/">Home</a>
            <a href="/characters">Characters</a>
        </nav>
        <h1>${character.name}</h1>
        <form id="editForm">
            <label for="name">Name: </label>
            <input type="text" id="name" name="name" value="${character.name}" required>
            <label for="age">Age:</label>
            <input type="number" id="age" name="ahe" value="${character.age}" required>
            <label for="origin">Place of Origin:</label>
            <input type="text" id="origin" name="origin" value="${character.origin}" required>
            <button type="submit">Edit Character</button>
        </form>
        <button onclick="deleteCharacter('${characters.name}')">Delete</button>
        <script>
            document.getElementById('editForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const name = document.getElementById('name').value;
                const age = document.getElementById('age').value;
                const origin = document.getElementById('origin').value;
                fetch('/characters/${character.name}', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        age: age,
                        origin: origin,
                    }),
                }).then(() => {
                    window.location.href = '/characters/' + name;
                });
            });

            function deleteCharacter(name) {
                if (confirm('Are you sure you want to delete this character?')) {
                    fetch('/characters/' + name, {
                        method: 'DELETE',
                    }).then(() => {
                        window.location.href = '/characters';
                    });
                }
            }
        </script>
        `)
    } else {
        res.status(404).send('Character not found');
    }
});

//UPDATE
app.post('/characters/:name', (req, res) => {
    const index = characters.findIndex(u => u.name === req.params.name);
    if (index !== -1) {
        characters[index] = {
            id: characters[index].id,
            name: req.body.name,
            age: req.body.age,
            origin: req.body.origin,
        };
        res.redirect(`/characters/${req.body.name}}`);
    } else {
        res.status(404).send('Character not found');
    }
});

//DELETE
app.delete('/characters/:name', (req, res) => {
    const index = characters.findIndex(u => u.name === req.params.name);
    if (index !== -1) {
        const deletedCharacter = characters.splice(index, 1);
        res.json(deletedCharacter);
    } else {
        res.status(404).send('Character not found')
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

