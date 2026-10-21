"""SEO and sharing metadata for the published Austrip design preview."""
import html,json,re
from urllib.parse import quote
from bs4 import BeautifulSoup
ORIGIN='https://www.meeting-scheduled.com'
BASE=ORIGIN+'/austrip/'
BRAND='אוסטריפ — לחוות את אוסטריה באמת'
IMAGE=BASE+'assets/austrip-share-v1.jpg'
IMAGE_ALT='אוסטריפ — טיולים וחוויות בעברית באוסטריה וסלובקיה, על רקע אגם והרים באוסטריה'
DESCRIPTIONS={
'wiener-alpen-spring-summer-trip':'טיול מווינה לאלפים הוינאים בעונת האביב והקיץ: נופי הרים, אגמים ואטרקציות. קראו את המסלול, מה כלול והאפשרויות לטיול קבוצתי או פרטי עם אוסטריפ.',
'bratislava-to-vienna-alps':'טיול יום מברטיסלבה לאלפים הוינאים עם אוסטריפ: טבע, נופי הרים ואטרקציות באוסטריה. עיינו בפרטי המסלול והמשיכו לבדיקת תאריכים וזמינות במערכת ההזמנות.',
'':'טיולים וחוויות בעברית בווינה, באוסטריה ובסלובקיה עם אוסטריפ. גלו אגמים, אלפים וקולינריה מקומית, בחרו טיול קבוצתי או פרטי והמשיכו לבדיקת זמינות והרשמה.',
'experiences':'גלו את הטיולים והחוויות של אוסטריפ באוסטריה ובסלובקיה. סננו לפי יציאה מווינה או מברטיסלבה, טבע, קולינריה וטיולי חורף, וצפו במסלולים ובאפשרויות ההרשמה.',
'services':'כל מה שמשלים את החופשה באוסטריה: הסעות מנמל התעופה, תכנון טיולים אישי, מלונות, קונצרטים, שייט וצילום. פרטים ואפשרויות פנייה ישירה לצוות אוסטריפ.',
'plan':'בחרו חוויה באוסטריה או בסלובקיה והעדפה לטיול קבוצתי או פרטי. המשיכו למערכת אוסטריפ לבדיקת תאריכים, זמינות, תנאים והשלמת ההרשמה.',
'all-pages':'כל עמודי אוסטריפ במקום אחד: טיולים מווינה ומברטיסלבה, קולינריה, הסעות, שירותים, שאלות נפוצות וטפסים. מצאו בקלות את המידע הדרוש לתכנון החופשה.',
'schedule':'לוח הטיולים הקבוצתיים של אוסטריפ היוצאים מווינה. עיינו ביעדים ובמועדים המתוכננים, ומשם עברו ללוח החי ולמערכת אוסטריפ לבדיקת זמינות ולהרשמה.',
'schedule-bratislava':'לוח הטיולים הקבוצתיים של אוסטריפ היוצאים מברטיסלבה: הקרפטים, עמק הווכאו והאלפים הוינאים. בדיקת הזמינות הסופית וההרשמה מתבצעות באתר אוסטריפ.',
'about-us':'הכירו את אוסטריפ: ישראלים החיים בווינה ומחברים מטיילים דוברי עברית לטבע, לתרבות ולקולינריה של אוסטריה. קראו על הצוות, הגישה והחוויות המוצעות.',
'faq':'תשובות לשאלות נפוצות על טיולי אוסטריפ: עונות השנה, יציאות, איסוף, הרכב הקבוצה, מחירים, הרשמה ותנאי ביטול. מצאו את המידע לפני תכנון הטיול.',
'contact-us':'צרו קשר עם צוות אוסטריפ לקבלת מידע וסיוע בהרשמה לטיולים ולחוויות באוסטריה ובסלובקיה. פרטי שעות המענה והמעבר לטופס המקורי נמצאים בעמוד.',
'waiting-list-form':'הטיול המבוקש מלא? המשיכו לטופס רשימת ההמתנה של אוסטריפ וציינו את החוויה, התאריכים והרכב המטיילים כדי שהצוות יוכל לבדוק אפשרויות עבורכם.',
'private-group-form':'מתכננים טיול פרטי באוסטריה או בסלובקיה? עברו לטופס אוסטריפ עם התאריכים, מספר המטיילים והמסלול המבוקש, לקבלת פרטים והצעה מהצוות.',
'pirvate-culinary-experience-form':'מעוניינים בסיור קולינרי פרטי בווינה? קראו את פרטי הבקשה והמשיכו לטופס אוסטריפ לתיאום מועד, הרכב משתתפים וחוויה קולינרית מתאימה.',
'join-austrip':'רוצים להצטרף לצוות אוסטריפ? קראו על האפשרויות והדרישות, והמשיכו לטופס הפנייה המקורי כדי ליצור קשר עם הצוות בווינה.',
'blog':'סיפורים, מסלולים וחוויות מהשטח בווינה ובסביבתה. קראו במגזין אוסטריפ על מקומות באוסטריה ומצאו רעיונות לחופשה הבאה שלכם.',
'legal':'פרטי העסק והמידע המשפטי של אוסטריפ, כפי שפורסמו באתר המקורי. מידע לזיהוי נותן השירות וקישור לעמוד המקורי והעדכני.',
'terms-and-conditions':'תקנון השימוש והשירות של אוסטריפ: מידע על תיאום חוויות, הזמנות, מקדמות ותנאי ביטול. עיינו בתנאים וקראו את התקנון העדכני באתר המקורי לפני הזמנה.',
 'thank-you':'מידע על המשך הטיפול בפנייה לאוסטריפ. עמוד זה הוא עותק לצפייה בלבד ואינו אישור לביצוע הזמנה, תשלום או שליחת פנייה.',
 'thank-you-public':'מידע על השלבים לאחר הרשמה באוסטריפ. עמוד זה הוא עותק לצפייה בלבד ואינו מעיד שבוצעה הרשמה, נשלחה פנייה או התקבל תשלום.'
}

def escape(value):return html.escape(str(value),quote=True)

def metadata(slug,title,desc,source=None):
 page_url=BASE+(quote(slug,safe='-_')+'/' if slug else '')
 seo_title=('טיולים בעברית באוסטריה, וינה וברטיסלבה' if not slug else title)+' | אוסטריפ'
 description=DESCRIPTIONS.get(slug) or re.sub(r'\s+',' ',desc).strip()
 if not description:description=f'{title} עם אוסטריפ. קראו את המידע, הכירו את האפשרויות לתכנון החופשה באוסטריה ובסלובקיה והמשיכו לפרטים ולהרשמה באתר אוסטריפ.'
 if len(description)>170:description=description[:167].rsplit(' ',1)[0]+'…'
 canonical=source or page_url
 tags=[f'<title>{escape(seo_title)}</title>',f'<meta name="description" content="{escape(description)}">',
 '<meta name="robots" content="noindex,follow,max-image-preview:large">',f'<link rel="canonical" href="{escape(canonical)}">']
 values={'og:type':'website','og:locale':'he_IL','og:site_name':BRAND,'og:title':seo_title,'og:description':description,'og:url':page_url,
 'og:image':IMAGE,'og:image:secure_url':IMAGE,'og:image:type':'image/jpeg','og:image:width':'1200','og:image:height':'630','og:image:alt':IMAGE_ALT}
 tags += [f'<meta property="{key}" content="{escape(value)}">' for key,value in values.items()]
 tags += [f'<meta name="{key}" content="{escape(value)}">' for key,value in {'twitter:card':'summary_large_image','twitter:title':seo_title,'twitter:description':description,'twitter:image':IMAGE,'twitter:image:alt':IMAGE_ALT}.items()]
 org={'@type':'Organization','@id':'https://austrip.co.il/#organization','name':BRAND,'url':'https://austrip.co.il/','logo':ORIGIN+'/austrip/assets/9e448188c6f75b0f.webp','sameAs':['https://www.facebook.com/austripTravel','https://www.instagram.com/austrip.co.il/']}
 site={'@type':'WebSite','@id':BASE+'#website','url':BASE,'name':BRAND,'inLanguage':'he-IL','publisher':{'@id':org['@id']}}
 page={'@type':'WebPage','@id':page_url+'#webpage','url':page_url,'name':seo_title,'description':description,'inLanguage':'he-IL','isPartOf':{'@id':site['@id']},'primaryImageOfPage':{'@type':'ImageObject','url':IMAGE,'width':1200,'height':630}}
 if source:page['isBasedOn']=source
 graph=[org,site,page]
 if slug:
  crumbs={'@type':'BreadcrumbList','@id':page_url+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'בית','item':BASE},{'@type':'ListItem','position':2,'name':title,'item':page_url}]}
  graph.append(crumbs);page['breadcrumb']={'@id':crumbs['@id']}
 payload=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('<','\\u003c')
 tags.append('<script type="application/ld+json">'+payload+'</script>')
 return ''.join(tags)
