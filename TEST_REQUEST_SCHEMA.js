// Check what columns actually exist in Supabase tables
// Run this in browser console after the page loads

(async () => {
    try {
        // Test with snake_case
        const testSnakeCase = {
            patient_name: "Test",
            blood_type: "A+",
            units: 1,
            location: "Test",
            contact: "Test",
            is_emergency: false,
            status: "pending"
        };
        
        console.log("Testing with snake_case fields...");
        let response = await fetch("http://localhost:3000/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testSnakeCase)
        });
        let data = await response.json();
        console.log("Snake case response:", data);
        
        if (!response.ok) {
            // Try camelCase
            const testCamelCase = {
                patientName: "Test",
                bloodType: "A+",
                units: 1,
                location: "Test",
                contact: "Test",
                isEmergency: false,
                status: "Pending"
            };
            
            console.log("Testing with camelCase fields...");
            response = await fetch("http://localhost:3000/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testCamelCase)
            });
            data = await response.json();
            console.log("CamelCase response:", data);
        }
    } catch (e) {
        console.error("Diagnostic error:", e);
    }
})();
