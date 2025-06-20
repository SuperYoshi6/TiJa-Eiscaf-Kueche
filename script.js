document.getElementById("submitOrder").addEventListener("click", function() {
    // Name des Gastes holen
    const guestName = document.getElementById("guestName").value.trim();

    // Wenn kein Name eingegeben wurde, zurückkehren
    if (guestName === "") {
        alert("Bitte gib deinen Namen ein.");
        return;
    }

    // Auswahl der Eissorten
    const selectedFlavors = [];
    if (document.getElementById("chocolate").checked) selectedFlavors.push("Schokolade");
    if (document.getElementById("vanilla").checked) selectedFlavors.push("Vanille");
    if (document.getElementById("strawberry").checked) selectedFlavors.push("Erdbeere");

    // Auswahl der Größe
    const size = document.getElementById("size").value;

    // Auswahl der Getränkeoptionen
    const selectedDrinks = [];
    if (document.getElementById("cola").checked) selectedDrinks.push("Cola");
    if (document.getElementById("water").checked) selectedDrinks.push("Wasser");
    if (document.getElementById("lemonade").checked) selectedDrinks.push("Limonade");

    // Bestellung zusammenstellen
    let orderDetails = `<strong>Name:</strong> ${guestName}<br>`;
    orderDetails += `<strong>Ausgewählte Sorten:</strong> ${selectedFlavors.join(", ")}<br>`;
    orderDetails += `<strong>Größe:</strong> ${size.charAt(0).toUpperCase() + size.slice(1)}<br>`;

    if (selectedDrinks.length > 0) {
        orderDetails += `<strong>Getränke:</strong> ${selectedDrinks.join(", ")}<br>`;
    } else {
        orderDetails += `<strong>Getränk:</strong> Kein Getränk<br>`;
    }

    // Bestellung anzeigen
    document.getElementById("orderDetails").innerHTML = orderDetails;
    document.getElementById("orderDisplay").style.display = "block";
});

// Getränkewahl sichtbar machen, wenn ausgewählt
document.getElementById("drinkChoice").addEventListener("change", function() {
    const drinkOptions = document.getElementById("drinkOptions");
    if (this.checked) {
        drinkOptions.style.display = "block";
    } else {
        drinkOptions.style.display = "none";
    }
});

// Keine Bestellung Option
document.getElementById("noOrderButton").addEventListener("click", function() {
    document.getElementById("guestName").value = "";
    document.getElementById("drinkChoice").checked = false;
    document.getElementById("drinkOptions").style.display = "none";
    document.getElementById("chocolate").checked = false;
    document.getElementById("vanilla").checked = false;
    document.getElementById("strawberry").checked = false;
    document.getElementById("size").value = "klein"; // Reset auf Standard
    document.getElementById("orderDisplay").style.display = "none"; // Bestellung ausblenden
});

// Supabase-Client initialisieren
const supabase = supabase.createClient(
  'https://bkrkztfybcmccwjjufym.supabase.co',   // ⬅️ Ersetze mit deiner Projekt-URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcmt6dGZ5YmNtY2N3amp1ZnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTk0OTAsImV4cCI6MjA2NTQ5NTQ5MH0.Wrtn346kdT51S7xyr2eN97idN7pkMGFhmAMLzW_-pvU'                    // ⬅️ Ersetze mit deinem API-Schlüssel
);

// Bestellung absenden
async function sendOrder() {
  const name = document.getElementById("guestName").value.trim();

  const ice = Array.from(document.querySelectorAll(".ice:checked"))
    .map(el => el.value)
    .join(", ");

  const drinks = Array.from(document.querySelectorAll(".drink:checked"))
    .map(el => el.value)
    .join(", ");

  // Eingabe überprüfen
  if (!name) {
    document.getElementById("status").innerText = "❗ Bitte gib deinen Namen ein.";
    return;
  }

  if (!ice && !drinks) {
    document.getElementById("status").innerText = "❗ Bitte wähle Eis oder ein Getränk.";
    return;
  }

  // Bestellung speichern
  const { error } = await supabase.from("orders").insert([
    {
      name: name,
      ice: ice || null,
      drinks: drinks || null
    }
  ]);

  // Ergebnis anzeigen
  document.getElementById("status").innerText = error
    ? "❌ Fehler beim Speichern"
    : "✅ Bestellung gespeichert!";

  // Formular zurücksetzen bei Erfolg
  if (!error) {
    document.getElementById("guestName").value = "";
    document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
    setTimeout(() => {
      document.getElementById("status").innerText = "";
    }, 3000);
  }
}

