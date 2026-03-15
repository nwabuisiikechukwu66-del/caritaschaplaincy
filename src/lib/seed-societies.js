const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY);

const societies = [
    {
        name: 'Altar Knights',
        patron_saint: 'Saint Tarcisius',
        about: 'The Altar Knights are a dedicated group of young men who assist the priests during liturgical celebrations. Their service is characterized by discipline, reverence, and a deep love for the Eucharist.',
        history: 'Founded at the inception of Caritas University, the Altar Knights have grown from a small group of students into a robust association focused on liturgical excellence.',
        why_join: 'Join us to serve at the foot of the Cross, grow in discipline, and enter a brotherhood of faith and service.',
        fun_facts: 'Our association is structured after the order of medieval knights, emphasizing chivalry and spiritual combat.'
    },
    {
        name: 'Altar Decorators',
        patron_saint: 'Saint Bernadette Soubirous',
        about: 'The Altar Decorators are the silent beautifiers of the sanctuary. They ensure that the physical space reflects the glory of God through flowers, linens, and sacred arrangements.',
        history: 'Stemming from a desire to make the university chapel a true home of God, the decorators have been essential in every liturgical season, from Advent to Easter.',
        why_join: 'If you have an eye for beauty and a heart for service, help us make the Lord\'s home beautiful.',
        fun_facts: 'Every flower arrangement is a silent prayer; we often include hidden symbols in our designs.'
    },
    {
        name: 'Caritas Central Choir',
        patron_saint: 'Saint Cecilia',
        about: 'The Central Choir leads the congregation in lifting their voices to God. They specialize in both contemporary and classical liturgical music, including Gregorian Chant.',
        history: 'As the voice of the Chaplaincy, the choir has performed at every major university event and continues to be a pillar of liturgical life.',
        why_join: 'Singing is praying twice! Join us to use your gift of music for the glory of God.',
        fun_facts: 'Our choir has a record of practicing for over 6 hours straight during major feast preparations!'
    },
    {
        name: 'Church Wardens',
        patron_saint: 'Saint Lawrence',
        about: 'The Wardens ensure that every person entering the chapel feels welcome and that the liturgy proceeds in an orderly and reverent manner.',
        history: 'The Wardens were established to maintain the sanctity of the university chapel as it grew in student population.',
        why_join: 'Serve as the face of hospitality and help maintain the "Great Silence" and order in the sanctuary.',
        fun_facts: 'Wardens are known as the "Guardians of the Sanctuary" and often have the best view of the entire congregation!'
    },
    {
        name: 'Board of Lectors',
        patron_saint: 'Saint Jerome',
        about: 'Lectors are the mouthpieces of God, proclaiming the Sacred Scriptures during the liturgy so that the Word may find a home in the hearts of the faithful.',
        history: 'The Board of Lectors was formed to ensure that the proclamation of the Word is done with the necessary training and spiritual preparation.',
        why_join: 'If you love the Word of God and wish to proclaim it with power and grace, this is your home.',
        fun_facts: 'Saint Jerome, our patron, once said "Ignorance of Scripture is ignorance of Christ."'
    },
    {
        name: 'Mary Queen of All Hearts',
        patron_saint: 'Mary, Queen of All Hearts',
        about: 'Guided by the Montfortian spirituality of Total Consecration, this society seeks to bring everyone to Jesus through Mary.',
        history: 'Inspired by the teaching of St. Louis de Montfort, this society was brought to Caritas to deepen the Marian devotion of students.',
        why_join: 'Deepen your relationship with Christ by giving everything to Mary, the shortest and surest path to holiness.',
        fun_facts: 'Members often wear a small "chain of love" to symbolize their total consecration.'
    },
    {
        name: 'Jesus the Saviour Society',
        patron_saint: 'Jesus the Saviour',
        about: 'A society dedicated to living and spreading the foundational charism of Very Rev. Fr. Prof. Emmanuel Matthew Paul Edeh.',
        history: 'Founded specifically to anchor the university community in the spirituality of the Saviourites.',
        why_join: 'Become a part of the foundational spirit of our school and congregation.',
        fun_facts: 'We are the "Home Society" of our institution, directly linked to our founder\'s vision.'
    },
    {
        name: 'Saint Anthony of Padua Society',
        patron_saint: 'Saint Anthony of Padua',
        about: 'Known for finding lost things, St. Anthony guides this society in finding lost souls and providing for the needy through "St. Anthony\'s Bread".',
        history: 'The society has been a staple of the chaplaincy, known for its powerful "Thirteen Tuesdays" novena.',
        why_join: 'Join the "Hammer of Heretics" in a life of prayer, powerful miracles, and charity.',
        fun_facts: 'St. Anthony is the only saint known to have held the Child Jesus in his arms.'
    },
    {
        name: 'Mother of Perpetual Help Society',
        patron_saint: 'Our Lady of Perpetual Help',
        about: 'A society focused on the intercessory power of Mary as depicted in the miraculous Redemptorist icon.',
        history: 'Started by students who found comfort in Mary\'s perpetual help during exams and personal trials.',
        why_join: 'Never feel alone in your struggles; Mary is our Perpetual Help.',
        fun_facts: 'The icon we venerate is full of symbols—the falling sandal of Jesus shows His human fear.'
    },
    {
        name: 'Sacred Hearts Society',
        patron_saint: 'The Sacred Heart of Jesus',
        about: 'This society seeks to make reparation for the indifference and ingratitude of the world toward the infinite love of Jesus.',
        history: 'Established to bring the devotion of St. Margaret Mary Alacoque to the university heart.',
        why_join: 'Comfort the Heart of Jesus and find rest for your soul in His love.',
        fun_facts: 'Members observe the "Nine First Fridays" in reparation.'
    },
    {
        name: 'Confraternity of the Most Holy Rosary (Rosarian Family)',
        patron_saint: 'Saint Dominic',
        about: 'The Rosarian Family is a community of students who gather daily to pray the Holy Rosary, the "weapon" for our times.',
        history: 'What started as a small group praying under a tree has become the Rosarian Family of Caritas.',
        why_join: 'Learn to contemplate the mysteries of Christ through the eyes of Mary.',
        fun_facts: 'St. Dominic received the Rosary from our Lady as a tool to defeat heresy.'
    },
    {
        name: 'Legion of Mary',
        patron_saint: 'Mary, Immaculata',
        about: 'The Legion is a structured lay apostolic organization that performs door-to-door evangelization and works of mercy.',
        history: 'The Legion of Mary in Caritas is part of a worldwide movement founded by Frank Duff in 1921.',
        why_join: 'Enter "Mary\'s Army" and become an active soldier for Christ in the world.',
        fun_facts: 'The Legion is the largest lay organization in the Catholic Church.'
    },
    {
        name: 'Infant Jesus Society',
        patron_saint: 'The Infant Jesus of Prague',
        about: 'A society that venerates the childhood of Jesus, emphasizing spiritual childhood and total trust in divine providence.',
        history: 'Introduced to help students maintain a spirit of simplicity in the midst of academic pressure.',
        why_join: 'Find peace in the simplicity of the Child Jesus.',
        fun_facts: '"The more you honor Me, the more I will bless you".'
    },
    {
        name: 'Two Hearts Society',
        patron_saint: 'Sacred Heart & Immaculate Heart',
        about: 'Focusing on the mystical union between the Sacred Heart of Jesus and the Immaculate Heart of Mary.',
        history: 'A relatively newer society in the chaplaincy with intense spiritual life.',
        why_join: 'Unite your heart to the two hearts that loved the world perfectly.',
        fun_facts: 'The Two Hearts are spiritually inseparable.'
    },
    {
        name: 'Charismatic Renewal',
        patron_saint: 'The Holy Spirit',
        about: 'A community that experiences the "Baptism in the Holy Spirit" and the exercise of charismatic gifts.',
        history: 'The Renewal has brought a new fire of praise and worship to Caritas.',
        why_join: 'Experience the power of Pentecost today!',
        fun_facts: 'The Renewal started with university students in 1967.'
    },
    {
        name: 'Precious Blood of Jesus Society',
        patron_saint: 'Saint Gaspar del Bufalo',
        about: 'Dedicated to the adoration of the Precious Blood of Jesus and the conversion of sinners.',
        history: 'A deep, contemplative society that anchors the chaplaincy in our redemptive price.',
        why_join: 'Meditate on the Blood that washed us clean.',
        fun_facts: 'St. Gaspar was the Apostle of the Precious Blood.'
    },
    {
        name: 'Divine Mercy Society',
        patron_saint: 'Saint Faustina Kowalska',
        about: 'Spreading the message of God\'s infinite mercy. We pray the Chaplet daily at 3 PM.',
        history: 'Vibrant group known for its devotion and works of mercy.',
        why_join: 'Help spread the message of hope to a world in need.',
        fun_facts: 'The icon was painted as Saint Faustina saw Jesus in a vision.'
    }
];

async function seed() {
    for (const s of societies) {
        const { error } = await supabase
            .from('societies')
            .update({
                patron_saint: s.patron_saint,
                about: s.about,
                history: s.history,
                why_join: s.why_join,
                fun_facts: s.fun_facts
            })
            .eq('name', s.name);

        if (error) console.error(`Error updating ${s.name}:`, error);
        else console.log(`Updated ${s.name}`);
    }
}

seed();
