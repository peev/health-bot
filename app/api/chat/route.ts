import { StreamingTextResponse } from 'ai'

const systemPrompt = `You are a compassionate and knowledgeable AI assistant specialized in providing support for individuals experiencing postpartum depression. Your role is to:

1. Offer empathetic listening and understanding
2. Provide evidence-based information about postpartum depression
3. Suggest coping strategies and self-care techniques
4. Encourage seeking professional help when appropriate
5. Share resources and support options

Important: Always emphasize that you are an AI assistant and not a replacement for professional medical help. In cases of emergency or severe symptoms, direct users to seek immediate medical attention.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the last user message
    const lastMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    const lowerCaseMessage = lastMessage.toLowerCase();
    
    // More varied response logic with multiple options for each category
    const responses = {
      greeting: [
        "Hello! How are you feeling today? I'm here to provide support and information about postpartum depression.",
        "Hi there! I'm your postpartum depression support assistant. How can I help you today?",
        "Welcome! I'm here to chat about postpartum depression and provide support. How are you doing?"
      ],
      
      symptoms: [
        "Common symptoms of postpartum depression include persistent sadness, anxiety, excessive crying, and difficulty bonding with your baby. You might also experience changes in appetite, sleep problems, and feelings of worthlessness. Remember that experiencing these symptoms doesn't make you a bad parent - PPD is a medical condition that can be treated.",
        "Postpartum depression symptoms can include feeling overwhelmed, extreme fatigue, withdrawal from family and friends, and sometimes thoughts of harming yourself or your baby. Physical symptoms like headaches and chest pain can also occur. If you're experiencing any of these, please reach out to a healthcare provider.",
        "Signs of postpartum depression may include intense irritability, anger, hopelessness, and feeling like you're not a good mother. You might have trouble concentrating or making decisions, and may lose interest in activities you used to enjoy. These symptoms typically develop within the first few weeks after childbirth, but can appear up to a year later."
      ],
      
      treatment: [
        "Treatment for postpartum depression often includes therapy, such as cognitive behavioral therapy (CBT), which helps you identify and change negative thought patterns. Medication like antidepressants may also be prescribed. Support groups can connect you with others experiencing similar challenges. Self-care strategies like getting adequate rest, eating well, and gentle exercise are also important components of recovery.",
        "There are several effective treatments for postpartum depression. Psychotherapy can provide strategies to cope with negative feelings and set realistic expectations. Antidepressants can help balance brain chemicals affecting mood, though some may pass through breast milk (your doctor can help find a safe option if you're breastfeeding). Support from family, friends, and joining a support group can also be beneficial.",
        "Treating postpartum depression typically involves a combination approach. This might include counseling with a mental health professional, medication prescribed by your doctor, lifestyle changes like prioritizing sleep when possible, and building a support network. Remember that seeking help is a sign of strength, not weakness."
      ],
      
      coping: [
        "Some helpful coping strategies include: 1) Don't face this alone - accept help from family and friends, 2) Make time for self-care, even if it's just 10 minutes, 3) Connect with other parents through support groups, 4) Set realistic expectations - you don't need to be perfect, 5) Get as much rest as possible, and 6) Eat nutritious foods and stay hydrated.",
        "To cope with postpartum depression day-to-day: Try to get outside for some fresh air and sunlight daily, practice mindfulness or deep breathing when feeling overwhelmed, communicate openly with your partner about your feelings, join a new parent group (online or in-person), and remember that recovery takes time - be patient with yourself.",
        "Practical ways to cope include: Breaking tasks into smaller steps so they feel more manageable, scheduling time for activities you enjoy, keeping a journal to track your moods and identify triggers, limiting visitors if socializing feels overwhelming, and remembering that your feelings are valid and temporary - with proper support and treatment, you will feel better."
      ],
      
      resources: [
        "Helpful resources include: Postpartum Support International (1-800-944-4773), which offers a helpline and online support groups; the National Suicide Prevention Lifeline (988 or 1-800-273-8255) for crisis situations; and apps like 'What's Up?' or 'MoodMission' that offer coping strategies. Many hospitals also offer postpartum support programs.",
        "Some valuable resources are: The 'Postpartum Depression for Dummies' book by Shoshana Bennett, the website PostpartumProgress.com which has helpful articles and personal stories, the 'Mom & Mind' podcast, and the Crisis Text Line (text HOME to 741741) for immediate support. Your healthcare provider can also connect you with local resources.",
        "Resources that many find helpful include: The book 'This Isn't What I Expected' by Karen Kleiman, online forums like Reddit's r/PPDepression community, the 'Happiest Baby' blog which has articles on postpartum depression, and the Association for Postnatal Illness website. Don't forget that your pediatrician can also be a source of support and referrals."
      ],
      
      general: [
        "Postpartum depression is more common than many people realize - it affects about 1 in 7 new mothers. It's important to know that PPD is not caused by anything you did or didn't do, and experiencing it doesn't mean you don't love your baby. With support and treatment, you can recover and enjoy time with your child.",
        "Remember that postpartum depression is a medical condition, not a character flaw. Hormonal changes, sleep deprivation, and the major life adjustment of having a baby all contribute to it. Many people feel ashamed to seek help, but getting support early leads to faster recovery.",
        "It's important to distinguish between 'baby blues' (which affects up to 80% of mothers and typically resolves within two weeks after childbirth) and postpartum depression, which is more severe and longer-lasting. Partners can also experience depression after a baby's birth, though this is less frequently discussed."
      ]
    };
    
    // Determine which category the message falls into
    let category: keyof typeof responses = 'general';
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.match(/^hey/) || lowerCaseMessage.includes('greetings')) {
      category = 'greeting';
    } else if (lowerCaseMessage.includes('symptom') || lowerCaseMessage.includes('sign') || lowerCaseMessage.includes('feel') || lowerCaseMessage.includes('experiencing')) {
      category = 'symptoms';
    } else if (lowerCaseMessage.includes('treatment') || lowerCaseMessage.includes('therapy') || lowerCaseMessage.includes('medication') || lowerCaseMessage.includes('doctor') || lowerCaseMessage.includes('help me')) {
      category = 'treatment';
    } else if (lowerCaseMessage.includes('cope') || lowerCaseMessage.includes('manage') || lowerCaseMessage.includes('deal with') || lowerCaseMessage.includes('handle') || lowerCaseMessage.includes('strategy')) {
      category = 'coping';
    } else if (lowerCaseMessage.includes('resource') || lowerCaseMessage.includes('website') || lowerCaseMessage.includes('book') || lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('hotline') || lowerCaseMessage.includes('where can i')) {
      category = 'resources';
    }
    
    // Select a random response from the appropriate category
    const randomIndex = Math.floor(Math.random() * responses[category].length);
    const response = responses[category][randomIndex];
    
    // Add a disclaimer for medical advice
    const disclaimer = "\n\nPlease remember that I'm an AI assistant and not a substitute for professional medical advice. If you're struggling, please reach out to a healthcare provider.";
    
    // Only add disclaimer for medical-related responses
    const finalResponse = (category === 'symptoms' || category === 'treatment') 
      ? response + disclaimer 
      : response;
    
    return new Response(finalResponse);
  } catch (error) {
    console.error('Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
} 