Math.round2 = (number, decimal = 4) => Number( Math.round(number + `e${decimal}`) + `e-${decimal}`)
