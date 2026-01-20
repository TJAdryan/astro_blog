import asyncio
import edge_tts

# Voices
VOICE_STORYBOOK = "en-US-ChristopherNeural"
VOICE_SENTIMENTAL = "en-US-AriaNeural"

# The text content extracted from wedding.astro
TEXT_PARTS = [
    ("The Wedding of Dominick and Sophio", VOICE_STORYBOOK),
    ("It was a September day in Brooklyn that felt like a gift—the kind of weather where the sun is bright but the air is crisp, signaling the perfect start to something new. On this morning, the light seemed to shine specifically for Dominick and Sophio.", VOICE_SENTIMENTAL),
    ("They arrived at City Hall in the morning, ready to make their bond official. Sophio looked absolutely beautiful, radiating a happiness that lit up the room. Standing beside her, Dominick was the picture of pride and devotion; he couldn’t take his eyes off her. The ceremony was intimate and deeply moving. The Justice presiding over the vows was warm and affirming, setting a tone of genuine love for the proceedings.", VOICE_STORYBOOK),
    ("Sophio was surrounded by a tight circle of love. Her daughter stood close, witnessing the moment, alongside Sophio’s aunt, who offered a steady, supportive presence. Her friend Natalie stepped up as bridesmaid, ensuring everything was perfect. Interestingly, the normally chatty Gvantsa was there, but she was surprisingly quiet—perhaps overcome by the weight and beauty of the moment.", VOICE_SENTIMENTAL),
    ("There was only one shadow on the bright day: Sophio’s mother was far away in her home country of Georgia and could not attend. However, her spirit was felt in the love Sophio carried with her.", VOICE_SENTIMENTAL),
    ("After the vows were spoken and the papers signed, the couple stepped out into the Brooklyn air. They made their way to the parks near the Brooklyn Bridge for photographs. The city itself seemed to want to join the celebration. Wherever they walked, strangers stopped in their tracks, their faces lighting up. \"Did you get married today?\" people asked, followed immediately by warm smiles and genuine cries of \"Congratulations!\" The kindness of strangers made the day feel even more magical.", VOICE_STORYBOOK),
    ("The celebration moved to Manhattan as they took the train to 14th Street. Walking west from 8th Avenue, they decided to stop for a quick bite in a utilitarian pizza dive. They couldn't help but laugh at the contrast—sitting in their formal wedding attire surrounded by paper plates and fluorescent lights. Dominick, wanting everything to be perfect, asked Sophio if she would prefer to go somewhere more upscale. She dismissed the idea out of hand, looking at him with a smile. \"As long as we are together,\" she said.", VOICE_STORYBOOK),
    ("They continued their journey toward the water, walking through the Meatpacking District. The cobblestone streets, long transformed into a playground for the well-heeled, provided a stunning backdrop. As they walked, they received even more compliments and smiles from the fashionable crowds, who were charmed by the happy couple.", VOICE_STORYBOOK),
    ("They eventually reached Little Island, the new park floating above the Hudson. Here, the circle widened. Sophio’s friends Irinka and the two Gvantsas were there to celebrate. Her friend Tina even rushed over after work to make sure she didn’t miss the joy. They laughed and relaxed by the water, soaking in the skyline and the excitement of what was to come.", VOICE_STORYBOOK),
    ("As evening fell, it was time for the grand finale: the Dinner Cruise.", VOICE_STORYBOOK),
    ("Once they boarded the boat, the party truly began. Dominick’s world merged with Sophio’s as his friends Wen, Sabina, and Pete joined the festivities. It was a gathering of lifetimes, as Dominick’s childhood friends, Fumiyo and James, were there. Dominick felt very honored that James's mother, Judy, was able to attend the festivities. She encouraged Dominick to dance with Sophio, even though it isn't something he typically enjoys. Dominick smartly listened to Judy. Later, he was so happy that he had listened that he invited Judy onto the dance floor, and the three of them enjoyed several songs together. Even Elizabeth, Dominick’s former office mate, came to celebrate; she had always been a vocal supporter of Dominick’s relationship with Sophio, and seeing them married was a special moment for her.", VOICE_STORYBOOK),
    ("The night became a blur of joy. They ate, drank, and chatted as the city lights drifted by outside the windows. The energy was high, but it peaked when the band leader, a charismatic woman with a commanding presence, took the microphone. She paused the music and asked the crowd, \"Did you two get married today?\"", VOICE_STORYBOOK),
    ("When Dominick and Sophio said yes, the room erupted. The band struck up a special tribute song just for them. Everyone—friends from childhood, friends from work, family, and new acquaintances—formed a circle, dancing around the newlyweds. It was a great evening, a loud and joyous declaration of a quiet and devoted love.", VOICE_SENTIMENTAL)
]

OUTPUT_FILE = "public/audio/english_wedding_v2.mp3"

async def main():
    print(f"Generating audio to {OUTPUT_FILE} using dual voices...")
    
    with open(OUTPUT_FILE, "wb") as f_out:
        for i, (text, voice) in enumerate(TEXT_PARTS):
            print(f"Processing part {i+1}/{len(TEXT_PARTS)} using {voice}...")
            communicate = edge_tts.Communicate(text, voice)
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    f_out.write(chunk["data"])
    
    print("Done! Audio file generated successfully.")

if __name__ == "__main__":
    asyncio.run(main())
