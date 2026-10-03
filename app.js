const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const bridge = window.still;

const LANGUAGE_CODES = `aa ab ae af ak am an ar as av ay az ba be bg bh bi bm bn bo br bs ca ce ch co cr cs cu cv cy da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu ace ach ada ady aeb afb alt amu anp apc apl arq ary arz asn ast avk awa ayc bal ban bax bbc bcl bej bem bho bik bin bla brh brx bto bug byn cad cdo ceb cgg chg chm chp chv chy ckb cmn cnh cop crh csb ctd cuc cvn dap dar dav ddn de-AT doi dsb dyo dyu efi egl emk eot ext fan fil fon frc frm fro frr frs gaa gag gan gcf gez gil glk gmh goh gom got gsw hak haw hif hne hnn hsn iba ibb ido ike ilo inh jam jbo jmc kaa kab kac kbd kbp kcg kdr kdt kez kfo khn kik kin kkj kmb koi kok kos kpe krc kri kru ksh ktb kum kxv lad lah lam lez lfn lgg lij liv lkt lmo lrc ltg lua luo lus luy mad mai mak mas mdf mhr mic min mni moh mos mri mwl myv nap naq nbl nds new nia niu njo nmg nnh nso nus nv nyo nyn oci ojp olo ori ota pag pam pap pdc pfl pms pnt pon prg pro raj rcf rhg rif rof rom rup sah sat sba scn sco sdc sgs shi shn sid sma smj sms snk srn srr szl tcy teo tet tig tiv tkl tmh tpi trv tsd tsg tzm udm uga umb vec vep vls vmf vro wal war wuu xal xmf yao yap ybb yid yue zgh zmi`.split(/\s+/);

const I18N = {
  en: { yourSpace:'YOUR SPACE', welcomeKicker:'A little room to think', welcomeLineOne:'The internet,', welcomeLineTwo:'at your pace.', welcomeSubtitle:'Find what you need. Keep what matters. Leave the noise behind.', heroSearch:'Search the web or enter a URL', quickLinks:'Quick links', edit:'Edit', focusMoment:'A moment to focus', focusCopy:'One tab at a time is enough.', quietByDesign:'Quiet by design', builtForYou:'Built around you', makeItYours:'Make it yours', assistantHub:'ASSISTANT HUB', aiAssistant:'AI assistant', notConnected:'Not connected', connect:'Connect', askAnything:'Ask anything, or use this page as context.', aiWelcome:'A thought partner, right here.', aiWelcomeBody:'Ask a question, explore an idea, or get a quick summary of this page.', chatPlaceholder:'Message your assistant…', aiCanBeWrong:'AI can make mistakes', yourKeys:'Your keys stay on this device', personalize:'PERSONALIZE', settings:'Settings', appearance:'Appearance', makeSpaceYours:'Make this space yours', theme:'Theme', themeDesc:'Choose your preferred look', accentColor:'Accent color', accentDesc:'A hint of color, your way', language:'Language', languageDesc:'Over 190 languages available', interfaceLanguage:'Interface language', languageCoverage:'Untranslated strings use English', privacy:'Privacy & browsing', privacyDesc:'Your browser, your rules', adBlocking:'Ad blocking', adBlockingDesc:'Block requests from common ad hosts', adblockNote:'Starter domain list. This is not a full filter-list blocker.', homepage:'Homepage', homepageDesc:'Keep only what helps', quickLinksWidget:'Quick links', quickLinksDesc:'Show your favorite sites', focusWidget:'Focus card', focusWidgetDesc:'A small reminder to slow down', shortcuts:'Keyboard shortcuts', shortcutsDesc:'Select a shortcut to change it', newTab:'New tab', closeTab:'Close tab', focusAddress:'Focus address bar', toggleAssistant:'Toggle AI assistant', shortcutHint:'Click a shortcut, then press the key combination you want.', aiConnections:'AI connections', aiKeysDesc:'Bring your own API keys', save:'Save', clear:'Clear', secureKeyNote:'Keys are stored encrypted by your operating system and sent only to the selected AI provider.', addressPlaceholder:'Search or enter address' },
  es: { yourSpace:'TU ESPACIO', welcomeKicker:'Un lugar para pensar', welcomeLineOne:'Internet,', welcomeLineTwo:'a tu ritmo.', welcomeSubtitle:'Encuentra lo que buscas. Quédate con lo importante. Deja atrás el ruido.', heroSearch:'Busca en la web o escribe una URL', quickLinks:'Accesos rápidos', edit:'Editar', focusMoment:'Un momento para concentrarte', focusCopy:'Una pestaña a la vez es suficiente.', quietByDesign:'Calma por diseño', builtForYou:'Hecho para ti', makeItYours:'Hazlo tuyo', assistantHub:'CENTRO DE ASISTENTES', aiAssistant:'Asistente de IA', notConnected:'Sin conexión', connect:'Conectar', askAnything:'Pregunta o usa esta página como contexto.', aiWelcome:'Una idea para pensar, aquí mismo.', aiWelcomeBody:'Haz una pregunta, explora una idea o resume esta página.', chatPlaceholder:'Escribe a tu asistente…', aiCanBeWrong:'La IA puede equivocarse', yourKeys:'Tus claves permanecen en este dispositivo', personalize:'PERSONALIZAR', settings:'Ajustes', appearance:'Apariencia', makeSpaceYours:'Adapta este espacio', theme:'Tema', themeDesc:'Elige tu aspecto preferido', accentColor:'Color de acento', accentDesc:'Un toque de color a tu manera', language:'Idioma', languageDesc:'Más de 190 idiomas disponibles', interfaceLanguage:'Idioma de la interfaz', languageCoverage:'Los textos no traducidos aparecen en inglés', privacy:'Privacidad y navegación', privacyDesc:'Tu navegador, tus reglas', adBlocking:'Bloqueo de anuncios', adBlockingDesc:'Bloquea solicitudes de dominios publicitarios comunes', adblockNote:'Lista básica de dominios; no es un bloqueador completo.', homepage:'Página de inicio', homepageDesc:'Conserva lo que te ayuda', quickLinksWidget:'Accesos rápidos', quickLinksDesc:'Muestra tus sitios favoritos', focusWidget:'Tarjeta de enfoque', focusWidgetDesc:'Un pequeño recordatorio para ir sin prisa', shortcuts:'Atajos de teclado', shortcutsDesc:'Selecciona un atajo para cambiarlo', newTab:'Nueva pestaña', closeTab:'Cerrar pestaña', focusAddress:'Enfocar la barra de direcciones', toggleAssistant:'Mostrar u ocultar el asistente de IA', shortcutHint:'Haz clic en un atajo y pulsa la combinación que quieras.', aiConnections:'Conexiones de IA', aiKeysDesc:'Usa tus propias claves de API', save:'Guardar', clear:'Borrar', secureKeyNote:'Las claves se cifran en el dispositivo y solo se envían al proveedor de IA elegido.', addressPlaceholder:'Busca o escribe una dirección' },
  fr: { yourSpace:'VOTRE ESPACE', welcomeKicker:'Un peu de place pour penser', welcomeLineOne:'Internet,', welcomeLineTwo:'à votre rythme.', welcomeSubtitle:'Trouvez ce qu’il vous faut. Gardez l’essentiel. Laissez le bruit derrière vous.', heroSearch:'Rechercher sur le web ou saisir une URL', quickLinks:'Liens rapides', edit:'Modifier', focusMoment:'Un instant pour se recentrer', focusCopy:'Un onglet à la fois, c’est suffisant.', quietByDesign:'Le calme par conception', builtForYou:'Pensé pour vous', makeItYours:'Personnaliser', assistantHub:'ESPACE IA', aiAssistant:'Assistant IA', notConnected:'Non connecté', connect:'Connecter', askAnything:'Posez une question ou utilisez cette page comme contexte.', aiWelcome:'Un partenaire de réflexion, ici.', aiWelcomeBody:'Posez une question, explorez une idée ou résumez cette page.', chatPlaceholder:'Écrivez à votre assistant…', aiCanBeWrong:'L’IA peut se tromper', yourKeys:'Vos clés restent sur cet appareil', personalize:'PERSONNALISER', settings:'Paramètres', appearance:'Apparence', makeSpaceYours:'Créez un espace à votre image', theme:'Thème', themeDesc:'Choisissez votre apparence', accentColor:'Couleur d’accent', accentDesc:'Une touche de couleur, à votre façon', language:'Langue', languageDesc:'Plus de 190 langues disponibles', interfaceLanguage:'Langue de l’interface', languageCoverage:'Les textes non traduits restent en anglais', privacy:'Confidentialité et navigation', privacyDesc:'Votre navigateur, vos règles', adBlocking:'Blocage des publicités', adBlockingDesc:'Bloquer les domaines publicitaires courants', adblockNote:'Liste de domaines de base, pas un filtre complet.', homepage:'Page d’accueil', homepageDesc:'Gardez ce qui vous aide', quickLinksWidget:'Liens rapides', quickLinksDesc:'Afficher vos sites favoris', focusWidget:'Carte de concentration', focusWidgetDesc:'Un petit rappel pour ralentir', shortcuts:'Raccourcis clavier', shortcutsDesc:'Sélectionnez un raccourci pour le modifier', newTab:'Nouvel onglet', closeTab:'Fermer l’onglet', focusAddress:'Activer la barre d’adresse', toggleAssistant:'Afficher l’assistant IA', shortcutHint:'Cliquez sur un raccourci puis saisissez la combinaison souhaitée.', aiConnections:'Connexions IA', aiKeysDesc:'Utilisez vos propres clés API', save:'Enregistrer', clear:'Effacer', secureKeyNote:'Les clés sont chiffrées sur l’appareil et envoyées uniquement au fournisseur choisi.', addressPlaceholder:'Rechercher ou saisir une adresse' },
  de: { yourSpace:'DEIN BEREICH', welcomeKicker:'Ein wenig Raum zum Denken', welcomeLineOne:'Das Internet,', welcomeLineTwo:'in deinem Tempo.', welcomeSubtitle:'Finde, was du suchst. Behalte das Wichtige. Lass den Lärm hinter dir.', heroSearch:'Im Web suchen oder URL eingeben', quickLinks:'Schnellzugriffe', edit:'Bearbeiten', focusMoment:'Ein Moment zum Durchatmen', focusCopy:'Ein Tab nach dem anderen reicht.', quietByDesign:'Ruhe mit Absicht', builtForYou:'Für dich gemacht', makeItYours:'Anpassen', assistantHub:'KI-ASSISTENTEN', aiAssistant:'KI-Assistent', notConnected:'Nicht verbunden', connect:'Verbinden', askAnything:'Frag etwas oder nutze diese Seite als Kontext.', aiWelcome:'Ein Denkpartner, direkt hier.', aiWelcomeBody:'Stelle eine Frage, erkunde eine Idee oder fasse diese Seite zusammen.', chatPlaceholder:'Nachricht an deinen Assistenten…', aiCanBeWrong:'KI kann Fehler machen', yourKeys:'Deine Schlüssel bleiben auf diesem Gerät', personalize:'PERSONALISIEREN', settings:'Einstellungen', appearance:'Darstellung', makeSpaceYours:'Gestalte deinen Bereich', theme:'Design', themeDesc:'Wähle deine bevorzugte Darstellung', accentColor:'Akzentfarbe', accentDesc:'Ein Hauch Farbe, ganz nach dir', language:'Sprache', languageDesc:'Über 190 Sprachen verfügbar', interfaceLanguage:'Oberflächensprache', languageCoverage:'Nicht übersetzte Texte erscheinen auf Englisch', privacy:'Datenschutz & Surfen', privacyDesc:'Dein Browser, deine Regeln', adBlocking:'Werbung blockieren', adBlockingDesc:'Anfragen üblicher Werbedomains blockieren', adblockNote:'Einfache Domainliste, kein vollständiger Filter.', homepage:'Startseite', homepageDesc:'Nur behalten, was dir hilft', quickLinksWidget:'Schnellzugriffe', quickLinksDesc:'Favoriten anzeigen', focusWidget:'Fokuskarte', focusWidgetDesc:'Eine kleine Erinnerung, langsamer zu machen', shortcuts:'Tastenkürzel', shortcutsDesc:'Kürzel zum Ändern auswählen', newTab:'Neuer Tab', closeTab:'Tab schließen', focusAddress:'Adressleiste fokussieren', toggleAssistant:'KI-Assistent ein-/ausblenden', shortcutHint:'Klicke auf ein Kürzel und drücke die gewünschte Tastenkombination.', aiConnections:'KI-Verbindungen', aiKeysDesc:'Eigene API-Schlüssel verwenden', save:'Speichern', clear:'Löschen', secureKeyNote:'Schlüssel werden auf diesem Gerät verschlüsselt und nur an den gewählten Anbieter gesendet.', addressPlaceholder:'Suchen oder Adresse eingeben' },
  pt: { yourSpace:'SEU ESPAÇO', welcomeKicker:'Um espaço para pensar', welcomeLineOne:'A internet,', welcomeLineTwo:'no seu ritmo.', welcomeSubtitle:'Encontre o que precisa. Guarde o que importa. Deixe o ruído para trás.', heroSearch:'Pesquise na web ou digite um URL', quickLinks:'Atalhos', edit:'Editar', focusMoment:'Um momento para focar', focusCopy:'Uma aba de cada vez já basta.', quietByDesign:'Calma por natureza', builtForYou:'Feito para você', makeItYours:'Personalizar', assistantHub:'CENTRAL DE IA', aiAssistant:'Assistente de IA', notConnected:'Não conectado', connect:'Conectar', askAnything:'Pergunte ou use esta página como contexto.', aiWelcome:'Uma parceria para pensar, aqui.', aiWelcomeBody:'Faça uma pergunta, explore uma ideia ou resuma esta página.', chatPlaceholder:'Mensagem para o assistente…', aiCanBeWrong:'A IA pode cometer erros', yourKeys:'Suas chaves ficam neste dispositivo', personalize:'PERSONALIZAR', settings:'Configurações', appearance:'Aparência', makeSpaceYours:'Deixe este espaço com a sua cara', theme:'Tema', themeDesc:'Escolha sua aparência', accentColor:'Cor de destaque', accentDesc:'Um toque de cor, do seu jeito', language:'Idioma', languageDesc:'Mais de 190 idiomas disponíveis', interfaceLanguage:'Idioma da interface', languageCoverage:'Textos sem tradução aparecem em inglês', privacy:'Privacidade e navegação', privacyDesc:'Seu navegador, suas regras', adBlocking:'Bloqueio de anúncios', adBlockingDesc:'Bloqueie domínios de anúncios comuns', adblockNote:'Lista básica de domínios; não é um filtro completo.', homepage:'Página inicial', homepageDesc:'Mantenha só o que ajuda', quickLinksWidget:'Atalhos', quickLinksDesc:'Mostre seus sites favoritos', focusWidget:'Cartão de foco', focusWidgetDesc:'Um lembrete para ir com calma', shortcuts:'Atalhos de teclado', shortcutsDesc:'Selecione um atalho para alterar', newTab:'Nova aba', closeTab:'Fechar aba', focusAddress:'Focar na barra de endereço', toggleAssistant:'Alternar assistente de IA', shortcutHint:'Clique em um atalho e pressione a combinação desejada.', aiConnections:'Conexões de IA', aiKeysDesc:'Use suas próprias chaves de API', save:'Salvar', clear:'Limpar', secureKeyNote:'As chaves são criptografadas neste dispositivo e enviadas apenas ao provedor escolhido.', addressPlaceholder:'Pesquise ou digite um endereço' },
  it: { yourSpace:'IL TUO SPAZIO', welcomeKicker:'Un po’ di spazio per pensare', welcomeLineOne:'Internet,', welcomeLineTwo:'al tuo ritmo.', welcomeSubtitle:'Trova ciò che cerchi. Tieni ciò che conta. Lascia indietro il rumore.', heroSearch:'Cerca sul web o inserisci un URL', quickLinks:'Link rapidi', edit:'Modifica', focusMoment:'Un momento per concentrarsi', focusCopy:'Una scheda alla volta è sufficiente.', quietByDesign:'La calma è una scelta', builtForYou:'Pensato per te', makeItYours:'Personalizza', assistantHub:'CENTRO AI', aiAssistant:'Assistente AI', notConnected:'Non connesso', connect:'Connetti', askAnything:'Fai una domanda o usa questa pagina come contesto.', aiWelcome:'Un compagno di idee, qui.', aiWelcomeBody:'Fai una domanda, esplora un’idea o riassumi questa pagina.', chatPlaceholder:'Scrivi al tuo assistente…', aiCanBeWrong:'L’AI può sbagliare', yourKeys:'Le tue chiavi restano su questo dispositivo', personalize:'PERSONALIZZA', settings:'Impostazioni', appearance:'Aspetto', makeSpaceYours:'Rendi tuo questo spazio', theme:'Tema', themeDesc:'Scegli il tuo aspetto preferito', accentColor:'Colore di accento', accentDesc:'Un tocco di colore, a modo tuo', language:'Lingua', languageDesc:'Oltre 190 lingue disponibili', interfaceLanguage:'Lingua dell’interfaccia', languageCoverage:'I testi non tradotti restano in inglese', privacy:'Privacy e navigazione', privacyDesc:'Il tuo browser, le tue regole', adBlocking:'Blocco annunci', adBlockingDesc:'Blocca le richieste dei domini pubblicitari comuni', adblockNote:'Elenco di base, non un filtro completo.', homepage:'Home page', homepageDesc:'Tieni solo ciò che ti aiuta', quickLinksWidget:'Link rapidi', quickLinksDesc:'Mostra i tuoi siti preferiti', focusWidget:'Scheda focus', focusWidgetDesc:'Un piccolo invito a rallentare', shortcuts:'Scorciatoie da tastiera', shortcutsDesc:'Seleziona una scorciatoia da modificare', newTab:'Nuova scheda', closeTab:'Chiudi scheda', focusAddress:'Vai alla barra degli indirizzi', toggleAssistant:'Mostra/nascondi assistente AI', shortcutHint:'Fai clic su una scorciatoia e premi la combinazione desiderata.', aiConnections:'Connessioni AI', aiKeysDesc:'Usa le tue chiavi API', save:'Salva', clear:'Cancella', secureKeyNote:'Le chiavi sono cifrate sul dispositivo e inviate solo al provider selezionato.', addressPlaceholder:'Cerca o inserisci un indirizzo' },
  ru: { yourSpace:'ТВОЁ ПРОСТРАНСТВО', welcomeKicker:'Немного места для мыслей', welcomeLineOne:'Интернет,', welcomeLineTwo:'в твоём ритме.', welcomeSubtitle:'Находи нужное. Сохраняй важное. Оставь шум в стороне.', heroSearch:'Искать в интернете или ввести адрес', quickLinks:'Быстрые ссылки', edit:'Изменить', focusMoment:'Минута для концентрации', focusCopy:'Одной вкладки за раз достаточно.', quietByDesign:'Спокойствие в деталях', builtForYou:'Создано для тебя', makeItYours:'Настроить', assistantHub:'ЦЕНТР ИИ', aiAssistant:'ИИ-помощник', notConnected:'Не подключено', connect:'Подключить', askAnything:'Задай вопрос или используй эту страницу как контекст.', aiWelcome:'Партнёр для размышлений — рядом.', aiWelcomeBody:'Задай вопрос, исследуй идею или кратко перескажи страницу.', chatPlaceholder:'Напиши помощнику…', aiCanBeWrong:'ИИ может ошибаться', yourKeys:'Ключи остаются на этом устройстве', personalize:'ПЕРСОНАЛИЗАЦИЯ', settings:'Настройки', appearance:'Внешний вид', makeSpaceYours:'Настрой пространство под себя', theme:'Тема', themeDesc:'Выбери оформление', accentColor:'Акцентный цвет', accentDesc:'Добавь немного своего цвета', language:'Язык', languageDesc:'Доступно более 190 языков', interfaceLanguage:'Язык интерфейса', languageCoverage:'Нет перевода — показываем английский текст', privacy:'Конфиденциальность и браузер', privacyDesc:'Твой браузер, твои правила', adBlocking:'Блокировка рекламы', adBlockingDesc:'Блокировать запросы известных рекламных доменов', adblockNote:'Базовый список доменов, не полноценный фильтр.', homepage:'Домашняя страница', homepageDesc:'Оставь только полезное', quickLinksWidget:'Быстрые ссылки', quickLinksDesc:'Показывать избранные сайты', focusWidget:'Карточка фокуса', focusWidgetDesc:'Небольшое напоминание не спешить', shortcuts:'Сочетания клавиш', shortcutsDesc:'Выбери сочетание, чтобы изменить его', newTab:'Новая вкладка', closeTab:'Закрыть вкладку', focusAddress:'Перейти в адресную строку', toggleAssistant:'Показать/скрыть ИИ-помощника', shortcutHint:'Нажми на сочетание, затем введи нужную комбинацию.', aiConnections:'Подключения ИИ', aiKeysDesc:'Используй собственные API-ключи', save:'Сохранить', clear:'Очистить', secureKeyNote:'Ключи хранятся в зашифрованном виде и отправляются только выбранному ИИ-сервису.', addressPlaceholder:'Поиск или адрес сайта' },
  ja: { yourSpace:'あなたのスペース', welcomeKicker:'考えるための、少しの余白', welcomeLineOne:'インターネットを、', welcomeLineTwo:'あなたのペースで。', welcomeSubtitle:'必要なものを見つけ、大切なものを残し、雑音から離れよう。', heroSearch:'ウェブを検索、または URL を入力', quickLinks:'クイックリンク', edit:'編集', focusMoment:'集中するひととき', focusCopy:'一度にひとつのタブで十分。', quietByDesign:'静けさをデザイン', builtForYou:'あなたのために', makeItYours:'カスタマイズ', assistantHub:'AI アシスタント', aiAssistant:'AI アシスタント', notConnected:'未接続', connect:'接続', askAnything:'質問するか、このページを文脈として使えます。', aiWelcome:'考えるパートナーがここに。', aiWelcomeBody:'質問したり、アイデアを探ったり、ページを要約できます。', chatPlaceholder:'アシスタントにメッセージ…', aiCanBeWrong:'AI は間違えることがあります', yourKeys:'キーはこのデバイスに保存されます', personalize:'カスタマイズ', settings:'設定', appearance:'外観', makeSpaceYours:'自分らしい空間に', theme:'テーマ', themeDesc:'好みの表示を選択', accentColor:'アクセントカラー', accentDesc:'好きな色をひとさじ', language:'言語', languageDesc:'190 以上の言語に対応', interfaceLanguage:'表示言語', languageCoverage:'未翻訳のテキストは英語で表示', privacy:'プライバシーとブラウジング', privacyDesc:'自分のブラウザーを自分らしく', adBlocking:'広告ブロック', adBlockingDesc:'一般的な広告ホストへの通信をブロック', adblockNote:'基本的なドメインリストです。完全なフィルターではありません。', homepage:'ホームページ', homepageDesc:'役立つものだけを表示', quickLinksWidget:'クイックリンク', quickLinksDesc:'お気に入りのサイトを表示', focusWidget:'フォーカスカード', focusWidgetDesc:'ゆっくり進むための小さなリマインダー', shortcuts:'キーボードショートカット', shortcutsDesc:'変更するショートカットを選択', newTab:'新しいタブ', closeTab:'タブを閉じる', focusAddress:'アドレスバーに移動', toggleAssistant:'AI アシスタントを切替', shortcutHint:'ショートカットをクリックして、キーの組み合わせを入力。', aiConnections:'AI 接続', aiKeysDesc:'自分の API キーを使用', save:'保存', clear:'削除', secureKeyNote:'キーは端末上で暗号化され、選択した AI プロバイダーにのみ送信されます。', addressPlaceholder:'検索またはアドレスを入力' },
  zh: { yourSpace:'你的空间', welcomeKicker:'留一点空间思考', welcomeLineOne:'互联网，', welcomeLineTwo:'按你的节奏。', welcomeSubtitle:'找到所需，留下重要的，让喧嚣留在身后。', heroSearch:'搜索网页或输入网址', quickLinks:'快捷链接', edit:'编辑', focusMoment:'片刻专注', focusCopy:'一次打开一个标签就够了。', quietByDesign:'为安静而设计', builtForYou:'为你打造', makeItYours:'自定义', assistantHub:'AI 助手中心', aiAssistant:'AI 助手', notConnected:'未连接', connect:'连接', askAnything:'提出问题，或将此页面用作上下文。', aiWelcome:'随时陪你思考。', aiWelcomeBody:'提出问题、探索想法，或快速总结此页面。', chatPlaceholder:'给助手发消息…', aiCanBeWrong:'AI 可能会出错', yourKeys:'密钥保留在此设备上', personalize:'个性化', settings:'设置', appearance:'外观', makeSpaceYours:'打造你的专属空间', theme:'主题', themeDesc:'选择你喜欢的外观', accentColor:'强调色', accentDesc:'用你喜欢的颜色点缀', language:'语言', languageDesc:'提供 190 多种语言', interfaceLanguage:'界面语言', languageCoverage:'未翻译的文字将显示为英语', privacy:'隐私与浏览', privacyDesc:'你的浏览器，你的规则', adBlocking:'广告拦截', adBlockingDesc:'拦截常见广告主机的请求', adblockNote:'基础域名列表，并非完整过滤器。', homepage:'主页', homepageDesc:'只保留有用的内容', quickLinksWidget:'快捷链接', quickLinksDesc:'显示你喜爱的网站', focusWidget:'专注卡片', focusWidgetDesc:'提醒自己放慢脚步', shortcuts:'键盘快捷键', shortcutsDesc:'选择要更改的快捷键', newTab:'新建标签页', closeTab:'关闭标签页', focusAddress:'聚焦地址栏', toggleAssistant:'切换 AI 助手', shortcutHint:'点击快捷键，然后按下你想要的组合键。', aiConnections:'AI 连接', aiKeysDesc:'使用你自己的 API 密钥', save:'保存', clear:'清除', secureKeyNote:'密钥在本机加密保存，只发送给所选 AI 服务。', addressPlaceholder:'搜索或输入网址' },
  hi: { yourSpace:'आपकी जगह', welcomeKicker:'सोचने के लिए थोड़ी जगह', welcomeLineOne:'इंटरनेट,', welcomeLineTwo:'आपकी रफ़्तार से।', welcomeSubtitle:'जो चाहिए उसे खोजें। ज़रूरी चीज़ें रखें। शोर को पीछे छोड़ें।', heroSearch:'वेब पर खोजें या URL दर्ज करें', quickLinks:'त्वरित लिंक', edit:'संपादित करें', focusMoment:'ध्यान केंद्रित करने का एक पल', focusCopy:'एक बार में एक टैब ही काफ़ी है।', quietByDesign:'शांति के लिए बनाया', builtForYou:'आपके लिए', makeItYours:'अपना बनाएँ', assistantHub:'AI सहायक केंद्र', aiAssistant:'AI सहायक', notConnected:'कनेक्ट नहीं है', connect:'कनेक्ट करें', askAnything:'कुछ पूछें या इस पेज को संदर्भ के रूप में उपयोग करें।', aiWelcome:'सोचने में मदद करने वाला साथी।', aiWelcomeBody:'सवाल पूछें, विचार खोजें या इस पेज का सारांश पाएँ।', chatPlaceholder:'अपने सहायक को संदेश दें…', aiCanBeWrong:'AI से गलती हो सकती है', yourKeys:'आपकी कुंजियाँ इसी डिवाइस पर रहती हैं', personalize:'अनुकूलित करें', settings:'सेटिंग्स', appearance:'दिखावट', makeSpaceYours:'अपनी जगह को अपना बनाएँ', theme:'थीम', themeDesc:'अपनी पसंदीदा शैली चुनें', accentColor:'मुख्य रंग', accentDesc:'अपनी पसंद का रंग', language:'भाषा', languageDesc:'190 से अधिक भाषाएँ उपलब्ध', interfaceLanguage:'इंटरफ़ेस भाषा', languageCoverage:'अनुवाद न होने पर अंग्रेज़ी दिखेगी', privacy:'गोपनीयता और ब्राउज़िंग', privacyDesc:'आपका ब्राउज़र, आपके नियम', adBlocking:'विज्ञापन रोकें', adBlockingDesc:'आम विज्ञापन होस्ट के अनुरोध रोकें', adblockNote:'बुनियादी डोमेन सूची, पूर्ण फ़िल्टर नहीं।', homepage:'होमपेज', homepageDesc:'सिर्फ़ उपयोगी चीज़ें रखें', quickLinksWidget:'त्वरित लिंक', quickLinksDesc:'अपनी पसंदीदा साइटें दिखाएँ', focusWidget:'फ़ोकस कार्ड', focusWidgetDesc:'धीरे चलने की एक छोटी याद', shortcuts:'कीबोर्ड शॉर्टकट', shortcutsDesc:'बदलने के लिए शॉर्टकट चुनें', newTab:'नया टैब', closeTab:'टैब बंद करें', focusAddress:'पता बार पर जाएँ', toggleAssistant:'AI सहायक टॉगल करें', shortcutHint:'शॉर्टकट चुनें, फिर मनचाहा की संयोजन दबाएँ।', aiConnections:'AI कनेक्शन', aiKeysDesc:'अपनी API कुंजियाँ जोड़ें', save:'सहेजें', clear:'हटाएँ', secureKeyNote:'कुंजियाँ डिवाइस पर एन्क्रिप्ट होती हैं और चुने हुए AI प्रदाता को ही भेजी जाती हैं।', addressPlaceholder:'खोजें या पता दर्ज करें' },
  ar: { yourSpace:'مساحتك', welcomeKicker:'مساحة صغيرة للتفكير', welcomeLineOne:'الإنترنت،', welcomeLineTwo:'على إيقاعك.', welcomeSubtitle:'اعثر على ما تحتاجه، واحتفظ بما يهمك، واترك الضجيج خلفك.', heroSearch:'ابحث في الويب أو أدخل عنوانًا', quickLinks:'روابط سريعة', edit:'تعديل', focusMoment:'لحظة للتركيز', focusCopy:'علامة تبويب واحدة في كل مرة تكفي.', quietByDesign:'هدوء من التصميم', builtForYou:'مصمم لك', makeItYours:'خصصه لك', assistantHub:'مركز المساعد الذكي', aiAssistant:'مساعد ذكي', notConnected:'غير متصل', connect:'اتصال', askAnything:'اسأل أو استخدم هذه الصفحة كسياق.', aiWelcome:'شريك للتفكير، هنا.', aiWelcomeBody:'اطرح سؤالًا أو استكشف فكرة أو لخّص هذه الصفحة.', chatPlaceholder:'أرسل رسالة إلى المساعد…', aiCanBeWrong:'قد يخطئ الذكاء الاصطناعي', yourKeys:'تبقى مفاتيحك على هذا الجهاز', personalize:'تخصيص', settings:'الإعدادات', appearance:'المظهر', makeSpaceYours:'اجعل المساحة تشبهك', theme:'السمة', themeDesc:'اختر مظهرك المفضل', accentColor:'لون التمييز', accentDesc:'لمسة لون بطريقتك', language:'اللغة', languageDesc:'أكثر من 190 لغة متاحة', interfaceLanguage:'لغة الواجهة', languageCoverage:'النصوص غير المترجمة تظهر بالإنجليزية', privacy:'الخصوصية والتصفح', privacyDesc:'متصفحك وقواعدك', adBlocking:'حظر الإعلانات', adBlockingDesc:'حظر الطلبات من نطاقات الإعلانات الشائعة', adblockNote:'قائمة نطاقات أساسية وليست مرشحًا كاملًا.', homepage:'الصفحة الرئيسية', homepageDesc:'احتفظ بما يفيدك فقط', quickLinksWidget:'روابط سريعة', quickLinksDesc:'إظهار مواقعك المفضلة', focusWidget:'بطاقة التركيز', focusWidgetDesc:'تذكير بسيط بالتأني', shortcuts:'اختصارات لوحة المفاتيح', shortcutsDesc:'اختر اختصارًا لتغييره', newTab:'علامة تبويب جديدة', closeTab:'إغلاق علامة التبويب', focusAddress:'الانتقال إلى شريط العناوين', toggleAssistant:'تبديل المساعد الذكي', shortcutHint:'انقر على اختصار ثم اضغط مجموعة المفاتيح المطلوبة.', aiConnections:'اتصالات الذكاء الاصطناعي', aiKeysDesc:'استخدم مفاتيح API الخاصة بك', save:'حفظ', clear:'مسح', secureKeyNote:'تُشفّر المفاتيح على هذا الجهاز ولا تُرسل إلا إلى مزود الذكاء الاصطناعي المحدد.', addressPlaceholder:'ابحث أو أدخل عنوانًا' }
};

const TOOLTIP_TRANSLATIONS = {
  en: { 'New tab':'New tab', Back:'Back', Forward:'Forward', Reload:'Reload', 'Add bookmark':'Add bookmark', 'AI assistant':'AI assistant', Settings:'Settings', Home:'Home', Bookmarks:'Bookmarks', 'Recent pages':'Recent pages', 'Your space':'Your space', 'Custom color':'Custom color' },
  es: { 'New tab':'Nueva pestaña', Back:'Atrás', Forward:'Adelante', Reload:'Recargar', 'Add bookmark':'Guardar marcador', 'AI assistant':'Asistente de IA', Settings:'Ajustes', Home:'Inicio', Bookmarks:'Marcadores', 'Recent pages':'Páginas recientes', 'Your space':'Tu espacio', 'Custom color':'Color personalizado' },
  fr: { 'New tab':'Nouvel onglet', Back:'Précédent', Forward:'Suivant', Reload:'Recharger', 'Add bookmark':'Ajouter un favori', 'AI assistant':'Assistant IA', Settings:'Paramètres', Home:'Accueil', Bookmarks:'Favoris', 'Recent pages':'Pages récentes', 'Your space':'Votre espace', 'Custom color':'Couleur personnalisée' },
  de: { 'New tab':'Neuer Tab', Back:'Zurück', Forward:'Vor', Reload:'Neu laden', 'Add bookmark':'Lesezeichen speichern', 'AI assistant':'KI-Assistent', Settings:'Einstellungen', Home:'Startseite', Bookmarks:'Lesezeichen', 'Recent pages':'Zuletzt besucht', 'Your space':'Dein Bereich', 'Custom color':'Eigene Farbe' },
  pt: { 'New tab':'Nova aba', Back:'Voltar', Forward:'Avançar', Reload:'Recarregar', 'Add bookmark':'Salvar favorito', 'AI assistant':'Assistente de IA', Settings:'Configurações', Home:'Início', Bookmarks:'Favoritos', 'Recent pages':'Páginas recentes', 'Your space':'Seu espaço', 'Custom color':'Cor personalizada' },
  it: { 'New tab':'Nuova scheda', Back:'Indietro', Forward:'Avanti', Reload:'Ricarica', 'Add bookmark':'Salva segnalibro', 'AI assistant':'Assistente AI', Settings:'Impostazioni', Home:'Home', Bookmarks:'Preferiti', 'Recent pages':'Pagine recenti', 'Your space':'Il tuo spazio', 'Custom color':'Colore personalizzato' },
  ru: { 'New tab':'Новая вкладка', Back:'Назад', Forward:'Вперёд', Reload:'Обновить', 'Add bookmark':'Сохранить закладку', 'AI assistant':'ИИ-помощник', Settings:'Настройки', Home:'Домой', Bookmarks:'Закладки', 'Recent pages':'Недавние страницы', 'Your space':'Твоё пространство', 'Custom color':'Свой цвет' },
  ja: { 'New tab':'新しいタブ', Back:'戻る', Forward:'進む', Reload:'再読み込み', 'Add bookmark':'ブックマークに追加', 'AI assistant':'AI アシスタント', Settings:'設定', Home:'ホーム', Bookmarks:'ブックマーク', 'Recent pages':'最近のページ', 'Your space':'あなたのスペース', 'Custom color':'カスタムカラー' },
  zh: { 'New tab':'新建标签页', Back:'后退', Forward:'前进', Reload:'重新加载', 'Add bookmark':'添加书签', 'AI assistant':'AI 助手', Settings:'设置', Home:'主页', Bookmarks:'书签', 'Recent pages':'最近访问', 'Your space':'你的空间', 'Custom color':'自定义颜色' },
  hi: { 'New tab':'नया टैब', Back:'पीछे', Forward:'आगे', Reload:'रीलोड करें', 'Add bookmark':'बुकमार्क जोड़ें', 'AI assistant':'AI सहायक', Settings:'सेटिंग्स', Home:'होम', Bookmarks:'बुकमार्क', 'Recent pages':'हाल के पेज', 'Your space':'आपकी जगह', 'Custom color':'अपना रंग' },
  ar: { 'New tab':'علامة تبويب جديدة', Back:'رجوع', Forward:'تقدم', Reload:'إعادة تحميل', 'Add bookmark':'إضافة إشارة مرجعية', 'AI assistant':'مساعد ذكي', Settings:'الإعدادات', Home:'الرئيسية', Bookmarks:'الإشارات المرجعية', 'Recent pages':'الصفحات الأخيرة', 'Your space':'مساحتك', 'Custom color':'لون مخصص' }
};
const SUGGESTION_TRANSLATIONS = {
  en: { summarize:'Summarize this page', explain:'Explain this', write:'Write something' }, es: { summarize:'Resume esta página', explain:'Explícalo', write:'Ayúdame a escribir' },
  fr: { summarize:'Résumer cette page', explain:'Expliquer', write:'M’aider à écrire' }, de: { summarize:'Diese Seite zusammenfassen', explain:'Erklären', write:'Etwas formulieren' },
  pt: { summarize:'Resumir esta página', explain:'Explique isto', write:'Ajude-me a escrever' }, it: { summarize:'Riassumi questa pagina', explain:'Spiegami', write:'Aiutami a scrivere' },
  ru: { summarize:'Кратко пересказать страницу', explain:'Объяснить', write:'Помочь написать' }, ja: { summarize:'このページを要約', explain:'説明する', write:'文章を書く' },
  zh: { summarize:'总结此页面', explain:'解释一下', write:'帮我写点内容' }, hi: { summarize:'इस पेज का सारांश', explain:'इसे समझाएँ', write:'लिखने में मदद' }, ar: { summarize:'لخّص هذه الصفحة', explain:'اشرح هذا', write:'ساعدني في الكتابة' }
};

const QUICK_DEFAULTS = [
  { name: 'Google', url: 'https://google.com', mark: 'G', color: 'blue' },
  { name: 'YouTube', url: 'https://youtube.com', mark: '▶', color: 'red' },
  { name: 'Wikipedia', url: 'https://wikipedia.org', mark: 'W', color: 'gray' },
  { name: 'GitHub', url: 'https://github.com', mark: '⌘', color: 'gray' },
  { name: 'Reddit', url: 'https://reddit.com', mark: 'r', color: 'orange' },
  { name: 'ChatGPT', url: 'https://chatgpt.com', mark: '✳', color: 'green' }
];
const PRIMARY_MODIFIER = navigator.platform.toLowerCase().includes('mac') ? 'Meta' : 'Ctrl';
const DEFAULT_SHORTCUTS = { newTab: `${PRIMARY_MODIFIER}+T`, closeTab: `${PRIMARY_MODIFIER}+W`, focusAddress: `${PRIMARY_MODIFIER}+L`, toggleAI: `${PRIMARY_MODIFIER}+Shift+A` };

let currentLocale = localStorage.getItem('still.language') || 'en';
let activeProvider = 'openai';
let activeTabId = null;
let recordingShortcut = null;
let includePageContext = false;
let toastTimer;
let pendingMessages = false;
let credentialStatus = { openai: false, gemini: false, encryptedAtRest: false };
let tabs = [];
let settingsOpen = false;
let aiOpen = false;
let listOpen = false;
let recentPages = getStored('still.recent', []);
let bookmarks = getStored('still.bookmarks', []);

function getStored(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; }
}
function setStored(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function tr(key) { return (I18N[currentLocale] && I18N[currentLocale][key]) || I18N.en[key] || key; }

function applyLocale(locale) {
  currentLocale = locale;
  localStorage.setItem('still.language', locale);
  const translations = I18N[locale] || {};
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { const key = el.dataset.i18n; el.textContent = translations[key] || I18N.en[key] || el.textContent; });
  $$('[data-i18n-placeholder]').forEach(el => { const key = el.dataset.i18nPlaceholder; el.placeholder = translations[key] || I18N.en[key] || el.placeholder; });
  const tooltips = TOOLTIP_TRANSLATIONS[locale] || TOOLTIP_TRANSLATIONS.en;
  $$('[data-tip]').forEach(el => {
    el.dataset.tipKey ||= el.dataset.tip;
    const label = tooltips[el.dataset.tipKey] || el.dataset.tipKey;
    el.dataset.tip = label;
    if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);
  });
  const suggestions = SUGGESTION_TRANSLATIONS[locale] || SUGGESTION_TRANSLATIONS.en;
  $$('[data-suggestion]').forEach(el => { el.textContent = suggestions[el.dataset.suggestion] || SUGGESTION_TRANSLATIONS.en[el.dataset.suggestion]; });
  $('#address').setAttribute('aria-label', translations.addressPlaceholder || I18N.en.addressPlaceholder);
  const option = $('#language-select');
  if (option) option.value = locale;
  updateShortcutLabels();
  updateDate();
  if (credentialStatus) updateCredentialUI();
}

function languageName(code, displayLocale = currentLocale) {
  try {
    const names = new Intl.DisplayNames([displayLocale], { type: 'language' });
    const name = names.of(code);
    return name && name.toLowerCase() !== code.toLowerCase() ? name : `${code} (${code})`;
  } catch { return `${code} (${code})`; }
}

function populateLanguages() {
  const select = $('#language-select');
  const unique = [...new Set([...LANGUAGE_CODES, ...Object.keys(I18N)])];
  const opts = unique.map(code => ({ code, label: languageName(code, 'en') })).sort((a, b) => a.label.localeCompare(b.label));
  const english = opts.find(opt => opt.code === 'en');
  const languageOptions = [english, ...opts.filter(opt => opt.code !== 'en')];
  select.innerHTML = languageOptions.map(({ code, label }) => `<option value="${code}">${label}</option>`).join('');
  select.value = unique.includes(currentLocale) ? currentLocale : 'en';
  if (!Object.hasOwn(I18N, select.value)) {
    showToast('This language is listed. The interface currently falls back to English.');
  }
}

function updateDate() {
  const el = $('#date-pill');
  try { el.textContent = new Intl.DateTimeFormat(currentLocale, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date()); }
  catch { el.textContent = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date()); }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function applyAppearance() {
  const theme = localStorage.getItem('still.theme') || 'dark';
  const chosen = theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : theme;
  document.documentElement.dataset.theme = chosen;
  $('#theme-select').value = theme;
  const accent = localStorage.getItem('still.accent') || '#c8a8ff';
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent-wash', `${accent}1f`);
  $('#custom-color').value = accent;
  $$('.swatch').forEach(button => button.classList.toggle('selected', button.dataset.color.toLowerCase() === accent.toLowerCase()));
}

function setToggle(button, enabled) {
  button.classList.toggle('on', Boolean(enabled));
  button.setAttribute('aria-checked', String(Boolean(enabled)));
}

function applyHomeWidgets() {
  $('#quick-section').hidden = !getStored('still.quickLinksWidget', true);
  $('#focus-card').hidden = !getStored('still.focusWidget', true);
  setToggle($('#quicklinks-switch'), getStored('still.quickLinksWidget', true));
  setToggle($('#focus-switch'), getStored('still.focusWidget', true));
}

function getShortcuts() { return { ...DEFAULT_SHORTCUTS, ...getStored('still.shortcuts', {}) }; }
function displayAccelerator(value) {
  if (/^Meta\+/i.test(value) && navigator.platform.toLowerCase().includes('mac')) return value.replaceAll('Meta', '⌘').replaceAll('Shift', '⇧').replaceAll('Alt', '⌥').replaceAll('+', ' ');
  return value.replaceAll('Meta', 'Ctrl').replaceAll('Shift', '⇧').replaceAll('Alt', 'Alt').replaceAll('+', ' + ');
}
function updateShortcutLabels() {
  const shortcuts = getShortcuts();
  $$('.shortcut-row').forEach(row => { row.querySelector('span').textContent = tr(row.dataset.shortcut); row.querySelector('kbd').textContent = displayAccelerator(shortcuts[row.dataset.shortcut]); });
}
function normalizeKey(key) {
  if (key === ' ') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  return key[0].toUpperCase() + key.slice(1);
}
function formatComboFromEvent(event) {
  const parts = [];
  if (event.metaKey) parts.push('Meta'); else if (event.ctrlKey) parts.push('Ctrl');
  if (event.shiftKey) parts.push('Shift');
  if (event.altKey) parts.push('Alt');
  if (!['Meta', 'Control', 'Shift', 'Alt'].includes(event.key)) parts.push(normalizeKey(event.key));
  return parts.length > 1 ? parts.join('+') : '';
}
function runShortcut(action) {
  if (action === 'newTab') createTab();
  if (action === 'closeTab') closeActiveTab();
  if (action === 'focusAddress') { $('#address').focus(); $('#address').select(); }
  if (action === 'toggleAI') toggleAI();
}
function handleShortcutCombo(combo) {
  const shortcuts = getShortcuts();
  const match = Object.entries(shortcuts).find(([, value]) => value.toLowerCase() === combo.toLowerCase());
  if (match) runShortcut(match[0]);
}
function syncShortcuts() { return bridge.setShortcuts(Object.values(getShortcuts())); }

function renderTabs() {
  const root = $('#tabs');
  root.innerHTML = '';
  for (const tab of tabs) {
    const button = document.createElement('button');
    button.className = `tab${tab.id === activeTabId ? ' active' : ''}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(tab.id === activeTabId));
    button.dataset.tabId = tab.id;
    const favicon = document.createElement('span');
    favicon.className = 'tab-favicon';
    if (tab.url) {
      try { const host = new URL(tab.url).hostname.replace(/^www\./, ''); favicon.textContent = host.slice(0, 1).toUpperCase(); }
      catch { favicon.textContent = '◦'; }
    } else favicon.textContent = '◦';
    const title = document.createElement('span'); title.className = 'tab-title'; title.textContent = tab.title || tr('newTab');
    const close = document.createElement('span'); close.className = 'tab-close'; close.setAttribute('role', 'button'); close.setAttribute('aria-label', 'Close tab'); close.innerHTML = '<svg viewBox="0 0 12 12"><path d="m3 3 6 6M9 3 3 9"/></svg>';
    button.append(favicon, title, close);
    button.addEventListener('click', event => { if (event.target.closest('.tab-close')) { event.stopPropagation(); if (tabs.length === 1 && tab.id === activeTabId) closeActiveTab(); else bridge.closeTab(tab.id); } else bridge.activateTab(tab.id); });
    root.append(button);
  }
  root.querySelector('.tab.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function activeTab() { return tabs.find(tab => tab.id === activeTabId); }
function updateNavigationState(tab = activeTab()) {
  $('#back').disabled = !tab?.canGoBack;
  $('#forward').disabled = !tab?.canGoForward;
  const bookmark = $('#bookmark');
  const isSaved = Boolean(tab?.url && bookmarks.some(item => item.url === tab.url));
  bookmark.classList.toggle('saved', isSaved);
  const tips = TOOLTIP_TRANSLATIONS[currentLocale] || TOOLTIP_TRANSLATIONS.en;
  bookmark.setAttribute('aria-label', isSaved ? 'Remove bookmark' : tips['Add bookmark']);
}

function renderAddress(tab = activeTab()) {
  if (!tab?.url) { $('#address').value = ''; return; }
  try {
    const parsed = new URL(tab.url);
    $('#address').value = `${parsed.host}${parsed.pathname === '/' ? '' : parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch { $('#address').value = tab.url; }
}

function layoutBrowserContent() {
  const surface = $('#web-surface');
  const tab = activeTab();
  const settingsBlocking = settingsOpen;
  surface.classList.toggle('ai-open', aiOpen && !settingsBlocking);
  surface.classList.toggle('settings-open', settingsBlocking);
  surface.classList.toggle('list-open', listOpen && !settingsBlocking);
  const hasPage = Boolean(tab?.url);
  $('#home-view').hidden = hasPage;
  $('#page-error').hidden = !tab?.error;
  if (!bridge) return;
  if (settingsBlocking || !hasPage || tab?.error) {
    bridge.setContentBounds({ x: 0, y: 0, width: 0, height: 0 });
    return;
  }
  const rect = surface.getBoundingClientRect();
  bridge.setContentBounds({ x: Math.round(rect.x), y: Math.round(rect.y), width: Math.max(0, Math.round(rect.width)), height: Math.max(0, Math.round(rect.height)) });
}

function setActive(id) {
  activeTabId = id;
  const selected = activeTab();
  renderTabs(); renderAddress(selected); updateNavigationState(selected); layoutBrowserContent();
  $('#home-button').classList.toggle('active', !selected?.url);
}

async function createTab(url = '') {
  const id = await bridge.createTab(url);
  if (!tabs.some(tab => tab.id === id)) tabs.push({ id, title: tr('newTab'), url: '', canGoBack: false, canGoForward: false });
  setActive(id);
  if (!url) { $('#address').value = ''; }
  return id;
}

async function closeActiveTab() {
  const tab = activeTab();
  if (!tab) return;
  if (tabs.length === 1) {
    await createTab();
    await bridge.closeTab(tab.id);
  } else await bridge.closeTab(tab.id);
}

function addRecent(url, title) {
  recentPages = [{ url, title: title || url, at: Date.now() }, ...recentPages.filter(item => item.url !== url)].slice(0, 18);
  setStored('still.recent', recentPages);
}

function handleTabEvent(payload) {
  let tab = tabs.find(item => item.id === payload.tabId);
  if (!tab) { tab = { id: payload.tabId, title: payload.title || 'New tab', url: payload.url || '', canGoBack: false, canGoForward: false }; tabs.push(tab); }
  if (payload.type === 'loading' && payload.loading) tab.error = '';
  if (payload.url !== undefined) tab.url = payload.url === 'about:blank' ? '' : payload.url;
  if (payload.title) tab.title = tab.url ? payload.title : tr('newTab');
  if (payload.canGoBack !== undefined) tab.canGoBack = payload.canGoBack;
  if (payload.canGoForward !== undefined) tab.canGoForward = payload.canGoForward;
  if (payload.type === 'navigate' && payload.url && payload.url !== 'about:blank') addRecent(payload.url, tab.title);
  if (payload.type === 'error') {
    tab.error = payload.error || 'The page could not be loaded.';
    $('#page-error').textContent = `This page could not be loaded. ${payload.error || ''}`;
  }
  if (payload.tabId === activeTabId) {
    renderTabs(); renderAddress(tab); updateNavigationState(tab); layoutBrowserContent();
  } else renderTabs();
}

function renderQuickLinks() {
  const items = getStored('still.quicklinks', QUICK_DEFAULTS);
  const root = $('#quick-grid'); root.innerHTML = '';
  items.slice(0, 6).forEach(item => {
    const button = document.createElement('button'); button.className = 'quick-card';
    const icon = document.createElement('span'); icon.className = `quick-icon ${item.color || 'gray'}`; icon.textContent = item.mark || item.name.slice(0, 1).toUpperCase();
    const label = document.createElement('span'); label.textContent = item.name;
    button.append(icon, label); button.title = item.url; button.addEventListener('click', () => navigate(item.url)); root.append(button);
  });
}

function navigate(value) {
  const tab = activeTab();
  if (!tab) return createTab(value);
  $('#page-error').hidden = true;
  closeListPopover();
  const trimmed = value.trim();
  if (!trimmed) return;
  tab.error = '';
  tab.url = trimmed;
  bridge.navigate(tab.id, trimmed);
  $('#home-view').hidden = true;
  layoutBrowserContent();
}

function openHome() {
  const tab = activeTab();
  if (tab) { tab.url = ''; tab.title = tr('newTab'); tab.error = ''; tab.canGoBack = false; tab.canGoForward = false; bridge.home(tab.id); }
  $('#address').value = '';
  renderTabs(); updateNavigationState(); layoutBrowserContent();
  $('#home-button').classList.add('active');
}

function openAI() {
  aiOpen = true;
  $('#ai-panel').classList.add('open');
  $('#ai-panel').setAttribute('aria-hidden', 'false');
  layoutBrowserContent();
}
function closeAI() {
  aiOpen = false;
  $('#ai-panel').classList.remove('open');
  $('#ai-panel').setAttribute('aria-hidden', 'true');
  layoutBrowserContent();
}
function toggleAI() { if (aiOpen) closeAI(); else { closeListPopover(); openAI(); } }

function closeListPopover() {
  $('#list-popover')?.remove();
  listOpen = false;
  layoutBrowserContent();
}

function openSettings() {
  closeListPopover();
  settingsOpen = true; closeAI();
  $('#settings-panel').classList.add('open'); $('#settings-panel').setAttribute('aria-hidden', 'false');
  $('#settings-backdrop').classList.add('open');
  layoutBrowserContent();
}
function closeSettings() {
  settingsOpen = false;
  $('#settings-panel').classList.remove('open'); $('#settings-panel').setAttribute('aria-hidden', 'true');
  $('#settings-backdrop').classList.remove('open');
  layoutBrowserContent();
}

function setProvider(provider) {
  activeProvider = provider;
  $$('.engine-tab').forEach(button => button.classList.toggle('selected', button.dataset.engine === provider));
  renderChatHistory();
  updateCredentialUI();
}
function updateCredentialUI() {
  const status = credentialStatus[activeProvider];
  $('#connection-label').textContent = status ? 'Connected' : tr('notConnected');
  $('#connection-label').classList.toggle('connected', Boolean(status));
  for (const provider of ['openai', 'gemini']) {
    const label = $(`#${provider}-key-status`);
    label.textContent = credentialStatus[provider] ? 'Connected' : 'Not connected';
    label.classList.toggle('connected', Boolean(credentialStatus[provider]));
  }
  $('#keys-footer').title = credentialStatus.encryptedAtRest ? 'Encrypted with OS storage' : 'OS credential encryption unavailable';
  $('#secure-key-note').textContent = credentialStatus.encryptedAtRest ? tr('secureKeyNote') : 'OS credential encryption is unavailable. API keys stay in memory for this session only.';
}

async function refreshCredentialStatus() {
  try { credentialStatus = await bridge.getCredentialStatus(); updateCredentialUI(); }
  catch (error) { showToast(error.message); }
}

function appendChat(text, role) {
  const welcome = $('.assistant-welcome'); if (welcome) welcome.remove();
  const bubble = document.createElement('div'); bubble.className = `chat-bubble ${role}`; bubble.textContent = text;
  $('#chat-messages').append(bubble); $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
  return bubble;
}

const chatHistory = { openai: [], gemini: [] };
function renderChatHistory() {
  const root = $('#chat-messages');
  root.replaceChildren();
  const history = chatHistory[activeProvider];
  if (!history.length) {
    const welcome = document.createElement('div');
    welcome.className = 'assistant-welcome';
    welcome.innerHTML = '<div class="assistant-mark">✳</div><h3></h3><p></p><div class="suggestion-chips"><button data-prompt="Summarize the key points on this page" data-suggestion="summarize"></button><button data-prompt="Help me understand this topic" data-suggestion="explain"></button><button data-prompt="Help me draft a response" data-suggestion="write"></button></div>';
    $('h3', welcome).textContent = tr('aiWelcome'); $('p', welcome).textContent = tr('aiWelcomeBody');
    const suggestions = SUGGESTION_TRANSLATIONS[currentLocale] || SUGGESTION_TRANSLATIONS.en;
    $$('[data-suggestion]', welcome).forEach(el => { el.textContent = suggestions[el.dataset.suggestion]; });
    $$('.suggestion-chips button', welcome).forEach(button => button.addEventListener('click', () => sendChat(button.dataset.prompt, button.dataset.suggestion === 'summarize')));
    root.append(welcome);
    return;
  }
  history.forEach(item => appendChat(item.text, item.role));
}

async function sendChat(rawPrompt, usePageContext = false) {
  const prompt = rawPrompt.trim();
  if (!prompt || pendingMessages) return;
  pendingMessages = true; $('#send-chat').disabled = true; $('#chat-input').value = '';
  const provider = activeProvider;
  const history = chatHistory[provider];
  const previous = history.slice(-12);
  history.push({ role: 'user', text: prompt });
  appendChat(prompt, 'user');
  const pending = appendChat('Thinking…', 'pending');
  let pageContext = '';
  try {
    if (usePageContext && !activeTab()?.url) throw new Error('Open a webpage first to summarize it.');
    if ((includePageContext || usePageContext) && activeTab()?.url) {
      const page = await bridge.extractPage(activeTabId);
      pageContext = `Title: ${page.title}\nURL: ${page.url}\n${page.text}`;
    }
    const answer = await bridge.askAI({ provider, prompt, pageContext, history: previous });
    pending.className = 'chat-bubble assistant'; pending.textContent = answer;
    history.push({ role: 'assistant', text: answer });
  } catch (error) {
    const errorText = error.message || 'Something went wrong. Check your connection and API key.';
    pending.className = 'chat-bubble assistant'; pending.textContent = errorText;
    history.push({ role: 'assistant', text: errorText });
  } finally {
    pendingMessages = false; $('#send-chat').disabled = false; $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
  }
}

function addBookmark() {
  const tab = activeTab();
  if (!tab?.url) { showToast('Open a page first to save a bookmark.'); return; }
  const exists = bookmarks.some(item => item.url === tab.url);
  if (exists) {
    bookmarks = bookmarks.filter(item => item.url !== tab.url);
    showToast('Bookmark removed');
  } else {
    bookmarks = [{ url: tab.url, title: tab.title || tab.url, at: Date.now() }, ...bookmarks];
    showToast('Page saved to bookmarks');
  }
  setStored('still.bookmarks', bookmarks); updateNavigationState(tab);
}

function showListPopover(kind, items) {
  closeListPopover();
  listOpen = true;
  let popover;
  popover = document.createElement('div'); popover.id = 'list-popover'; popover.className = 'list-popover';
  const heading = document.createElement('div'); heading.className = 'popover-heading'; heading.innerHTML = `<b>${kind === 'bookmarks' ? 'Bookmarks' : 'Recent pages'}</b><button type="button" aria-label="Close">×</button>`;
  heading.querySelector('button').addEventListener('click', closeListPopover); popover.append(heading);
  if (!items.length) { const empty = document.createElement('p'); empty.className = 'popover-empty'; empty.textContent = kind === 'bookmarks' ? 'Pages you save will appear here.' : 'Pages you visit will appear here.'; popover.append(empty); }
  items.slice(0, 12).forEach(item => {
    const row = document.createElement('button'); row.className = 'popover-link';
    const title = document.createElement('span'); title.textContent = item.title || item.url;
    const url = document.createElement('small'); url.textContent = item.url;
    row.append(title, url); row.addEventListener('click', () => { navigate(item.url); closeListPopover(); }); popover.append(row);
  });
  $('.stage').append(popover);
  layoutBrowserContent();
}

function editQuickLinks() {
  const current = getStored('still.quicklinks', QUICK_DEFAULTS);
  const input = window.prompt('Paste a website address to add a quick link (leave blank to restore defaults):', '');
  if (input === null) return;
  const value = input.trim();
  if (!value) { setStored('still.quicklinks', QUICK_DEFAULTS); renderQuickLinks(); return showToast('Quick links restored'); }
  const url = /^(https?:\/\/)/i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    const name = window.prompt('Name this quick link:', parsed.hostname.replace(/^www\./, '').split('.')[0]);
    if (name === null || !name.trim()) return;
    const next = [{ name: name.trim(), url: parsed.href, mark: name.trim().slice(0, 1).toUpperCase(), color: 'violet' }, ...current.filter(item => item.url !== parsed.href)].slice(0, 6);
    setStored('still.quicklinks', next); renderQuickLinks(); showToast('Quick link added');
  } catch { showToast('Enter a valid website address.'); }
}

function installListeners() {
  $('#new-tab').addEventListener('click', () => createTab());
  $('#address-form').addEventListener('submit', event => { event.preventDefault(); navigate($('#address').value); $('#address').blur(); });
  $('#hero-search').addEventListener('click', () => { $('#address').focus(); $('#address').select(); });
  $('#back').addEventListener('click', () => activeTabId && bridge.go(activeTabId, 'back'));
  $('#forward').addEventListener('click', () => activeTabId && bridge.go(activeTabId, 'forward'));
  $('#reload').addEventListener('click', () => activeTabId && (activeTab()?.url ? bridge.go(activeTabId, 'reload') : renderQuickLinks()));
  $('#bookmark').addEventListener('click', addBookmark);
  $('#home-button').addEventListener('click', openHome);
  $('#bookmarks-button').addEventListener('click', () => showListPopover('bookmarks', bookmarks));
  $('#history-button').addEventListener('click', () => showListPopover('history', recentPages));
  $('#open-ai').addEventListener('click', toggleAI); $('#rail-ai').addEventListener('click', toggleAI);
  $('#close-ai').addEventListener('click', closeAI);
  $('#open-settings').addEventListener('click', openSettings); $('#open-settings-footer').addEventListener('click', openSettings);
  $('#close-settings').addEventListener('click', closeSettings); $('#settings-backdrop').addEventListener('click', closeSettings);
  $('#edit-links').addEventListener('click', editQuickLinks);
  $$('.engine-tab').forEach(button => button.addEventListener('click', () => setProvider(button.dataset.engine)));
  $('#manage-keys').addEventListener('click', openSettings); $('#keys-footer').addEventListener('click', openSettings);
  $('#include-page').addEventListener('click', () => {
    includePageContext = !includePageContext; $('#include-page').classList.toggle('on', includePageContext); $('#include-page').setAttribute('aria-checked', String(includePageContext));
    const tab = activeTab(); $('#context-status').textContent = includePageContext && tab?.url ? `Using ${tab.title}` : includePageContext ? 'Ready to use the current page' : tr('askAnything');
  });
  $('#chat-form').addEventListener('submit', event => { event.preventDefault(); sendChat($('#chat-input').value); });
  $('#chat-input').addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); $('#chat-form').requestSubmit(); } });
  $$('.suggestion-chips button').forEach(button => button.addEventListener('click', () => sendChat(button.dataset.prompt, button.dataset.suggestion === 'summarize')));
  $$('.small-action[data-save-key]').forEach(button => button.addEventListener('click', async () => {
    const provider = button.dataset.saveKey; const field = $(`#${provider}-key`); const value = field.value.trim();
    if (!value) return showToast('Paste an API key first.');
    try { await bridge.saveCredential(provider, value); field.value = ''; await refreshCredentialStatus(); showToast(credentialStatus.encryptedAtRest ? 'API key saved securely on this device.' : 'Key saved for this session; OS encryption is unavailable.'); }
    catch (error) { showToast(error.message); }
  }));
  $$('.small-action[data-clear-key]').forEach(button => button.addEventListener('click', async () => {
    try { await bridge.clearCredential(button.dataset.clearKey); await refreshCredentialStatus(); showToast('API key cleared.'); } catch (error) { showToast(error.message); }
  }));
  $('#theme-select').addEventListener('change', event => { localStorage.setItem('still.theme', event.target.value); applyAppearance(); });
  $$('.swatch').forEach(button => button.addEventListener('click', () => { localStorage.setItem('still.accent', button.dataset.color); applyAppearance(); }));
  $('#custom-color').addEventListener('input', event => { localStorage.setItem('still.accent', event.target.value); applyAppearance(); });
  $('#language-select').addEventListener('change', event => { applyLocale(event.target.value); if (!Object.hasOwn(I18N, event.target.value)) showToast('This language is listed. The interface currently falls back to English.'); });
  $('#adblock-switch').addEventListener('click', async event => { const enabled = !event.currentTarget.classList.contains('on'); setToggle(event.currentTarget, enabled); localStorage.setItem('still.adblock', String(enabled)); await bridge.setAdBlock(enabled); showToast(enabled ? 'Starter ad blocking enabled.' : 'Ad blocking disabled.'); });
  $('#quicklinks-switch').addEventListener('click', () => { const enabled = !$('#quicklinks-switch').classList.contains('on'); setStored('still.quickLinksWidget', enabled); applyHomeWidgets(); });
  $('#focus-switch').addEventListener('click', () => { const enabled = !$('#focus-switch').classList.contains('on'); setStored('still.focusWidget', enabled); applyHomeWidgets(); });
  $$('.shortcut-row').forEach(row => row.addEventListener('click', () => { recordingShortcut = row.dataset.shortcut; $$('.shortcut-row').forEach(item => item.classList.toggle('recording', item === row)); row.querySelector('kbd').textContent = 'Press keys…'; showToast('Press the shortcut combination you want. Escape cancels.'); }));
  window.addEventListener('keydown', event => {
    if (recordingShortcut) {
      if (event.key === 'Escape') { recordingShortcut = null; updateShortcutLabels(); return; }
      const combo = formatComboFromEvent(event);
      if (combo) { const shortcuts = getShortcuts(); shortcuts[recordingShortcut] = combo; setStored('still.shortcuts', shortcuts); syncShortcuts(); recordingShortcut = null; $$('.shortcut-row').forEach(item => item.classList.remove('recording')); updateShortcutLabels(); showToast('Shortcut updated'); event.preventDefault(); }
      return;
    }
    if (event.key === 'Escape') { if (settingsOpen) closeSettings(); else if (aiOpen) closeAI(); }
    const combo = formatComboFromEvent(event);
    if (combo && Object.values(getShortcuts()).some(value => value.toLowerCase() === combo.toLowerCase())) { event.preventDefault(); handleShortcutCombo(combo); }
  });
  window.addEventListener('resize', layoutBrowserContent);
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if ((localStorage.getItem('still.theme') || 'dark') === 'system') applyAppearance(); });
  new ResizeObserver(layoutBrowserContent).observe($('#stage'));
  bridge.on('browser:tab-event', handleTabEvent);
  bridge.on('browser:tab-created', payload => {
    if (!tabs.some(tab => tab.id === payload.id)) tabs.push({ id: payload.id, title: payload.title || 'New tab', url: payload.url || '', canGoBack: false, canGoForward: false });
    if (payload.active) activeTabId = payload.id;
    renderTabs(); setActive(payload.id);
  });
  bridge.on('browser:tab-closed', ({ id }) => {
    tabs = tabs.filter(tab => tab.id !== id);
    if (activeTabId === id) { activeTabId = tabs.at(-1)?.id || null; if (activeTabId) bridge.activateTab(activeTabId); }
    renderTabs(); renderAddress(); updateNavigationState(); layoutBrowserContent();
  });
  bridge.on('browser:tab-activated', ({ id }) => setActive(id));
  bridge.on('browser:shortcut', payload => {
    const parts = [];
    if (payload.metaKey) parts.push('Meta'); else if (payload.ctrlKey) parts.push('Ctrl');
    if (payload.shiftKey) parts.push('Shift'); if (payload.altKey) parts.push('Alt');
    if (payload.key) parts.push(normalizeKey(payload.key));
    handleShortcutCombo(parts.join('+'));
  });
}

async function init() {
  populateLanguages(); applyLocale(currentLocale); applyAppearance(); renderQuickLinks(); applyHomeWidgets();
  $('.hero-search kbd').textContent = navigator.platform.toLowerCase().includes('mac') ? '⌘ L' : 'Ctrl L';
  installListeners(); updateDate();
  const adblock = localStorage.getItem('still.adblock') === 'true'; setToggle($('#adblock-switch'), adblock); await bridge.setAdBlock(adblock);
  await syncShortcuts();
  await refreshCredentialStatus();
  const existing = await bridge.getActiveTab();
  if (existing) { activeTabId = existing; if (!tabs.some(tab => tab.id === existing)) tabs.push({ id: existing, title: 'New tab', url: '', canGoBack: false, canGoForward: false }); setActive(existing); }
  else await createTab();
}

init().catch(error => showToast(`Browser could not initialize: ${error.message}`));
