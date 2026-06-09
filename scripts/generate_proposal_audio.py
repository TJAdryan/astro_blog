import asyncio
import edge_tts
import os

# English Voices
VOICE_STORYBOOK = "en-US-ChristopherNeural"
VOICE_SENTIMENTAL = "en-US-AriaNeural"

ENGLISH_TEXT_PARTS = [
    ("On a warm summer Saturday, Sophio planned a special day to propose to Dominick. After treating him to brunch, they traveled to MoMA PS1 in Queens, an old schoolhouse-turned-gallery. As they explored the contemporary art installations, Sophio carried a small velvet ring box hidden in her pocket.", VOICE_STORYBOOK),
    ("Watching Dominick contemplate a large sculpture, Sophio reflected on his unwavering support as her partner. Deciding she wanted to spend the rest of her life with him, she took his hands and drew him into the center of the room beneath the high windows.", VOICE_STORYBOOK),
    ("We spend so much time looking at what others have created, Sophio said, but the most beautiful thing I’ve ever seen is the life we’ve built together.", VOICE_STORYBOOK),
    ("She dropped to one knee, opened the ring box, and asked, Dominick, you are my home and my greatest adventure. Will you marry me?", VOICE_STORYBOOK),
    ("Dominick immediately answered yes, pulling her into a fierce embrace as the surrounding gallery visitors erupted into cheers and applause.", VOICE_STORYBOOK)
]

# Georgian Text Parts (full story in Georgian)
GEORGIAN_TEXT_PARTS = [
    "თბილ ზაფხულის შაბათს, სოფიომ დომინიკისთვის ხელის სათხოვნელად განსაკუთრებული დღე დაგეგმა. ბრანჩზე დაპატიჟების შემდეგ, ისინი გაემგზავრნენ MoMA PS1-ში კვინსში, რომელიც ძველი სკოლის შენობაში მოწყობილ გალერეას წარმოადგენს. სანამ ისინი თანამედროვე ხელოვნების ინსტალაციებს ათვალიერებდნენ, სოფიოს ჯიბეში პატარა ხავერდის ყუთში დამალული ბეჭედი ედო.",
    "სანამ დომინიკი დიდ ქანდაკებას აკვირდებოდა, სოფიო ფიქრობდა მის ურყევ მხარდაჭერაზე, როგორც პარტნიორზე. გადაწყვიტა, რომ მასთან ერთად სურდა დარჩენილი ცხოვრების გატარება, ხელი ჩაჰკიდა და ოთახის ცენტრში, მაღალი ფანჯრების ქვეშ გაიყვანა.",
    "ჩვენ იმდენ დროს ვატარებთ სხვების შექმნილის ყურებაში, - თქვა სოფიომ, - მაგრამ ყველაზე ლამაზი რამ, რაც კი ოდესმე მინახავს, ის ცხოვრებაა, რომელიც ჩვენ ერთად ავაშენეთ.",
    "იგი ცალ მუხლზე დაეშვა, ბეჭდის ყუთი გახსნა და ჰკითხა: დომინიკ, შენ ჩემი სახლი და ჩემი უდიდესი თავგადასავალი ხარ. ჩემზე დაქორწინდები?",
    "დომინიკმა მაშინვე თანხმობა უთხრა და ძლიერად ჩაეხუტა მას, ხოლო გალერეის გარშემო მყოფი სტუმრები მხიარული შეძახილებითა და აპლოდისმენტებით აფეთქდნენ."
]

GEORGIAN_VOICE = "ka-GE-EkaNeural"

ENGLISH_OUTPUT = "public/audio/english_proposal.mp3"
GEORGIAN_OUTPUT = "public/audio/georgian_proposal.mp3"

async def generate_english():
    print(f"Generating English proposal audio to {ENGLISH_OUTPUT}...")
    with open(ENGLISH_OUTPUT, "wb") as f_out:
        for i, (text, voice) in enumerate(ENGLISH_TEXT_PARTS):
            print(f"  Processing English part {i+1}/{len(ENGLISH_TEXT_PARTS)} using {voice}...")
            communicate = edge_tts.Communicate(text, voice)
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    f_out.write(chunk["data"])
    print("English proposal audio generated.")

async def generate_georgian():
    print(f"Generating Georgian proposal audio to {GEORGIAN_OUTPUT}...")
    full_text = "\n\n".join(GEORGIAN_TEXT_PARTS)
    communicate = edge_tts.Communicate(full_text, GEORGIAN_VOICE)
    await communicate.save(GEORGIAN_OUTPUT)
    print("Georgian proposal audio generated.")

async def main():
    os.makedirs("public/audio", exist_ok=True)
    await generate_english()
    await generate_georgian()
    print("All proposal audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
