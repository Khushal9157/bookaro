// seedEvents.js
// Run with: node seedEvents.js
// Make sure your API gateway + inventory service are running first!

const events = [
    // Batch 1 (original 10)
    { title: "Coldplay: Music of the Spheres", description: "Coldplay live in concert with stunning visual effects", venue: "DY Patil Stadium, Mumbai", eventDate: "2026-12-25T19:00:00" },
    { title: "Arijit Singh Live", description: "An unforgettable night with Bollywood's most loved voice", venue: "Jawaharlal Nehru Stadium, Delhi", eventDate: "2026-11-15T20:00:00" },
    { title: "Sunburn Festival", description: "Asia's biggest electronic dance music festival", venue: "Vagator Beach, Goa", eventDate: "2026-12-28T16:00:00" },
    { title: "AR Rahman Concert", description: "The Mozart of Madras performs his greatest hits live", venue: "YMCA Grounds, Chennai", eventDate: "2026-10-20T19:30:00" },
    { title: "Diljit Dosanjh: Dil-Luminati Tour", description: "Punjab's biggest star brings the house down", venue: "Punjab Cricket Association Stadium, Mohali", eventDate: "2026-09-14T19:00:00" },
    { title: "IPL Finals 2027", description: "The most anticipated cricket match of the year", venue: "Wankhede Stadium, Mumbai", eventDate: "2027-05-25T19:30:00" },
    { title: "Comic Con India", description: "India's biggest pop culture and comics convention", venue: "Bombay Exhibition Centre, Mumbai", eventDate: "2026-12-06T10:00:00" },
    { title: "Nucleya Live", description: "Bass Raja brings the heaviest electronic beats live", venue: "Maidan, Kolkata", eventDate: "2026-11-01T20:00:00" },
    { title: "Zakir Hussain: Tabla Maestro", description: "A classical evening with the legend of tabla", venue: "Siri Fort Auditorium, Delhi", eventDate: "2026-10-05T18:30:00" },
    { title: "NH7 Weekender", description: "India's happiest music festival with 50+ artists", venue: "Shillong, Meghalaya", eventDate: "2026-11-20T12:00:00" },

    // Batch 2 (20 more)
    { title: "Ed Sheeran: Mathematics Tour", description: "The global superstar performs his greatest hits live", venue: "Jawaharlal Nehru Stadium, Delhi", eventDate: "2026-09-05T19:00:00" },
    { title: "Badshah Live: Boss Tour", description: "India's rap king brings the biggest hip-hop show", venue: "NSCI Dome, Mumbai", eventDate: "2026-10-10T20:00:00" },
    { title: "Shreya Ghoshal Live", description: "An enchanting evening with Bollywood's nightingale", venue: "Palace Grounds, Bangalore", eventDate: "2026-09-20T19:30:00" },
    { title: "Imagine Dragons World Tour", description: "Rock anthems from one of the world's biggest bands", venue: "DY Patil Stadium, Mumbai", eventDate: "2026-11-08T19:00:00" },
    { title: "Lollapalooza India", description: "India's premier international music festival", venue: "Mahalaxmi Racecourse, Mumbai", eventDate: "2027-01-17T12:00:00" },
    { title: "KK Tribute Concert", description: "A musical tribute to the legendary singer KK", venue: "Netaji Indoor Stadium, Kolkata", eventDate: "2026-10-31T19:00:00" },
    { title: "The Chainsmokers Live", description: "EDM giants bring their electrifying show to India", venue: "Bengaluru International Exhibition Centre", eventDate: "2026-12-12T20:00:00" },
    { title: "Vishal-Shekhar Live", description: "Bollywood's most energetic composer duo perform live", venue: "Sardar Patel Stadium, Ahmedabad", eventDate: "2026-11-22T19:30:00" },
    { title: "Indian Premier League: MI vs CSK", description: "The El Clasico of IPL — Mumbai vs Chennai", venue: "Wankhede Stadium, Mumbai", eventDate: "2027-04-15T19:30:00" },
    { title: "Prateek Kuhad Live", description: "Indie folk sensation performs his soulful originals", venue: "Amphitheatre, Pune", eventDate: "2026-09-27T19:00:00" },
    { title: "Metallica World Tour India", description: "Heavy metal legends perform for the first time in India", venue: "Bharat Ratna Atal Bihari Vajpayee Stadium, Lucknow", eventDate: "2026-12-19T18:30:00" },
    { title: "Guru Randhawa Live", description: "Punjab pop star brings non-stop energy to the stage", venue: "Tau Devi Lal Stadium, Gurgaon", eventDate: "2026-10-03T20:00:00" },
    { title: "Anuv Jain Live", description: "The indie pop darling performs Baarishein and more", venue: "Rangasthala, Hyderabad", eventDate: "2026-09-13T19:00:00" },
    { title: "Shankar-Ehsaan-Loy Concert", description: "30 years of iconic Bollywood music performed live", venue: "Bal Gandharva Rang Mandir, Pune", eventDate: "2026-11-29T19:00:00" },
    { title: "Global Citizen Festival India", description: "Music for a cause featuring top global and Indian artists", venue: "MMRDA Grounds, Mumbai", eventDate: "2026-10-17T15:00:00" },
    { title: "Ritviz Live: Sage Tour", description: "Electronic indie artist performs Udd Gaye and more", venue: "Anticlockwise, Bangalore", eventDate: "2026-09-06T20:00:00" },
    { title: "A.R. Rahman: Jai Ho Tour", description: "Oscar winner performs Slumdog Millionaire soundtrack live", venue: "Lal Bahadur Shastri Stadium, Hyderabad", eventDate: "2027-02-14T19:00:00" },
    { title: "Darshan Raval Live", description: "Romantic melodies from Bollywood's favourite heartbreak singer", venue: "Sardar Vallabhbhai Patel Indoor Stadium, Mumbai", eventDate: "2026-10-24T19:30:00" },
    { title: "Hariharan Classical Night", description: "An evening of ghazals and classical music", venue: "Kamani Auditorium, Delhi", eventDate: "2026-11-07T18:00:00" },
    { title: "Oktoberfest India: Pune Edition", description: "India's biggest beer and music festival", venue: "Corinthians Resort, Pune", eventDate: "2026-10-02T14:00:00" },
];

async function seed() {
    console.log("🌱 Starting event + seat seeding...\n");

    let success = 0;
    let failed = 0;

    for (const event of events) {
        try {
            const res = await fetch("http://localhost:3000/inventory/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-token": "bookaro_internal_secret",
                },
                body: JSON.stringify({
                    ...event,
                    rows: 10,        // 10 rows (A–J)
                    seatsPerRow: 20, // 20 seats per row = 200 seats per event
                    price: 500,      // ₹500 per seat
                }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log(`✅ Created: ${event.title}`);
                success++;
            } else {
                console.log(`❌ Failed:  ${event.title} → ${JSON.stringify(data)}`);
                failed++;
            }
        } catch (err) {
            console.log(`❌ Error:   ${event.title} → ${err.message}`);
            failed++;
        }
    }

    console.log(`\n🎉 Done! ${success} created, ${failed} failed.`);
    console.log("Run: SELECT COUNT(*) FROM seats; — should show " + (success * 200) + " seats");
}

seed();