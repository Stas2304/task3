const express = require('express');

const app = express();

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function lcm(a, b) {

    const numX = parseInt(a.replace('{', '').replace('}', ''), 10);
    const numY = parseInt(b.replace('{', '').replace('}', ''), 10);

    if (!numX || !numY || numX <= 0 || numY <= 0) {
      return res.type('text').send('NaN');
    }

    const bigA = BigInt(Math.abs(numX));
    const bigB = BigInt(Math.abs(numY));
    const bigGcd = BigInt(gcd(numX, numY));
    
    if (bigGcd === 0n) return 0;
    
    const result = (bigA * bigB) / bigGcd;
    
    if (result > Number.MAX_SAFE_INTEGER) {
        return bigInt(a, b).toString();
    }
    
    return Number(result);
}

const bigInt = (v1, v2) => {
  function gcdBigInt(a, b) {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
  }

  function lcmBigInt(a, b) {
    if (a === 0n || b === 0n) return 0n;
    const g = gcdBigInt(a, b);
    return (a * b) / g;
  }

  return lcmBigInt(BigInt(v1), BigInt(v2));
}

function isValidNaturalNumber(input) {
    if (typeof input !== 'string') return false;
    
    const trimmed = input.replace(/^0+(?=\d)/, '');

    if (!/^\d+$/.test(trimmed)) return false;
    
    const num = Number(trimmed);
    return Number.isInteger(num) && num > 0;
}

const path = '/ystl1302_gmail_com';
app.get(path, (req, res) => {
  console.log(req.query)
    try {
        const { x, y } = req.query;
        
        if (x === undefined || y === undefined) {
            return res.type('text').send('NaN');
        }
        
        if (!isValidNaturalNumber(x.toString()) || !isValidNaturalNumber(y.toString())) {
            return res.type('text').send('NaN');
        }

        const result = lcm(x, y);
        
        return res.type('text').send(result.toString());
        
    } catch (error) {
        console.error('Error in LCM calculation:', error);
        return res.type('text').send('NaN');
    }
});

app.get('/test', (req, res) => {
    const testCases = [
        { x: '12', y: '18', expected: '36' },
        { x: '7', y: '13', expected: '91' },
        { x: '15', y: '25', expected: '75' },
        { x: '1', y: '1', expected: '1' },
        { x: '1000000', y: '1000000', expected: '1000000' },
        { x: '0', y: '5', expected: 'NaN' },
        { x: '-5', y: '10', expected: 'NaN' },
        { x: 'abc', y: '10', expected: 'NaN' },
        { x: '12.5', y: '10', expected: 'NaN' },
        { x: '', y: '10', expected: 'NaN' },
        { x: '012', y: '18', expected: '36' },
        { x: '999999999999999', y: '999999999999999', expected: '999999999999999' }
    ];
    
    let html = '<h1>Тестовые случаи</h1><table border="1"><tr><th>x</th><th>y</th><th>Ожидаемый</th><th>Фактический</th><th>Статус</th></tr>';
    
    testCases.forEach(test => {
        const url = `${path}?x=${encodeURIComponent(test.x)}&y=${encodeURIComponent(test.y)}`;
        html += `<tr>
            <td>${test.x}</td>
            <td>${test.y}</td>
            <td>${test.expected}</td>
            <td><a href="${url}">Проверить</a></td>
            <td id="test_${test.x}_${test.y}">-</td>
        </tr>`;
    });
    
    html += '</table><script>testAll(); async function testAll() { ' + 
        testCases.map(test => `
            try {
                const response = await fetch('${path}?x=${encodeURIComponent(test.x)}&y=${encodeURIComponent(test.y)}');
                const result = await response.text();
                const cell = document.getElementById('test_${test.x}_${test.y}');
                if (result === '${test.expected}') {
                    cell.innerHTML = '✓ OK';
                    cell.style.color = 'green';
                } else {
                    cell.innerHTML = '✗ Got: ' + result;
                    cell.style.color = 'red';
                }
            } catch(e) {
                document.getElementById('test_${test.x}_${test.y}').innerHTML = '✗ Error';
            }
        `).join('') + '}</script>';
    
    res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`✅ LCM API запущен на порту ${PORT}`);
    console.log(`📚 Документация: http://localhost:${PORT}/`);
    console.log(`🧪 Тесты: http://localhost:${PORT}/test`);
    console.log(`📊 Пример: http://localhost:${PORT}${path}?x=12&y=18`);
});