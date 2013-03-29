# Copyright (C) 2013 Martin Snajdr

msgid ""
msgstr ""
"Project-Id-Version: Dev\n"
"Report-Msgid-Bugs-To: \n"
"POT-Creation-Date: <?php echo date("Y-m-d H:iO"); ?>\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Last-Translator: FULL NAME <email@address.com>\n"
"Language-Team: LANGUAGE \n"
"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\"\n"

<?php foreach($translation_strings as $string): ?>
msgid "<?php echo $string['single'] ?>"
<?php if (isset($string['plural'])): ?>
msgid_plural "<?php echo $string['plural'] ?>"
msgstr[0] ""
msgstr[1] ""
<?php else: ?>
msgstr ""
<?php endif ?>

<?php endforeach; ?>

