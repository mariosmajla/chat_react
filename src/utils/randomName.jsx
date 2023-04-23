function RandomName() {
    const time = new Date().getTime().toString();
    return `Korisnik ${time}`
}

export default RandomName