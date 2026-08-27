export class Overlay {
    constructor(scene) {
        this.scene = scene;
    }

    // GAME OVER OVERLAY
    showGameOver() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Dunkler, halbtransparenter Hintergrund über das gesamte Spiel
        const backdrop = this.scene.add.graphics();
        backdrop.fillStyle(0x000000, 0.75);
        backdrop.fillRect(0, 0, width, height);
        backdrop.setScrollFactor(0).setDepth(200);

        // Dialog-Kasten in der Mitte
        const boxWidth = 440;
        const boxHeight = 240;
        const boxX = centerX - boxWidth / 2;
        const boxY = centerY - boxHeight / 2;

        const box = this.scene.add.graphics();
        box.fillStyle(0x120808, 0.95);
        box.fillRect(boxX, boxY, boxWidth, boxHeight, 12);
        box.lineStyle(2, 0xff4d4d, 0.9); // Roter Rahmen
        box.strokeRect(boxX, boxY, boxWidth, boxHeight, 12);
        box.setScrollFactor(0).setDepth(201);

        // Titeltext
        this.scene.add.text(centerX, boxY + 45, 'DU BIST GESTORBEN', {
            fontSize: '24px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#ff4d4d'
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(202);

        // Button: Nochmal spielen
        const retryBtn = this.scene.add.text(centerX, boxY + 115, 'Nochmal versuchen', {
            fontSize: '18px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#ff6666',
            backgroundColor: '#3b1212',
            padding: { x: 18, y: 8 }
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(202)
            .setInteractive({ useHandCursor: true });


        retryBtn.on('pointerover', () => {
            retryBtn.setStyle({ color: '#ffffff', backgroundColor: '#6e1f1f' });
            this.scene.sound.play('hover-button-sound', { volume: 0.3 });
        });

        retryBtn.on('pointerout', () => retryBtn.setStyle({ color: '#ff6666', backgroundColor: '#3b1212' }));
        retryBtn.on('pointerdown', () => {
            if (this.scene.bgMusic) this.scene.bgMusic.stop();
            this.scene.scene.restart({ level: this.scene.currentLevel || 1 });
        });

        // Button: Menü
        const menuBtn = this.scene.add.text(centerX, boxY + 175, 'MENÜ', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#aaaaaa',
            backgroundColor: '#1f1f1f',
            padding: { x: 16, y: 6 }
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(202)
            .setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => {
            menuBtn.setStyle({ color: '#ffffff', backgroundColor: '#3a3a3a' });
            this.scene.sound.play('hover-button-sound', { volume: 0.3 });
        });

        menuBtn.on('pointerout', () => menuBtn.setStyle({ color: '#aaaaaa', backgroundColor: '#1f1f1f' }));
        menuBtn.on('pointerdown', () => {
            if (this.scene.bgMusic) this.scene.bgMusic.stop();
            this.scene.scene.start('MenuScene');
        });
    }

    // GEWONNEN OVERLAY
    showWin() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        const currentLevel = this.scene.currentLevel || 1;
        const maxLevel = 3; // Maximale Level-Anzahl

        // Dunkler, halbtransparenter Hintergrund
        const backdrop = this.scene.add.graphics();
        backdrop.fillStyle(0x000000, 0.75);
        backdrop.fillRect(0, 0, width, height);
        backdrop.setScrollFactor(0).setDepth(200);

        // Dialog-Kasten in der Mitte
        const boxWidth = 460;
        const boxHeight = 240;
        const boxX = centerX - boxWidth / 2;
        const boxY = centerY - boxHeight / 2;

        const box = this.scene.add.graphics();
        box.fillStyle(0x07150d, 0.95);
        box.fillRect(boxX, boxY, boxWidth, boxHeight, 12);
        box.lineStyle(2, 0xffd700, 0.9);
        box.strokeRect(boxX, boxY, boxWidth, boxHeight, 12);
        box.setScrollFactor(0).setDepth(201);

        // Dynamische Texte je nach Level
        let titleText = `★ LEVEL ${currentLevel} GESCHAFFT! ★`;
        let buttonLabel = `▶ Level ${currentLevel + 1} spielen`;
        let nextLevel = currentLevel + 1;

        // Wenn das letzte Level (Level 3) geschafft wurde:
        if (currentLevel >= maxLevel) {
            titleText = '★ SPIEL GEWONNEN! ★';
            buttonLabel = 'Erneut spielen';
            nextLevel = 1; // Startet danach wieder bei Level 1
        }

        // Titel
        this.scene.add.text(centerX, boxY + 45, titleText, {
            fontSize: '22px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#ffd700'
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(202);

        // Haupt-Aktions-Button
        const actionBtn = this.scene.add.text(centerX, boxY + 115, buttonLabel, {
            fontSize: '18px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#55ff99',
            backgroundColor: '#0d381e',
            padding: { x: 18, y: 8 }
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(202)
            .setInteractive({ useHandCursor: true });

        actionBtn.on('pointerover', () => {
            actionBtn.setStyle({ color: '#ffffff', backgroundColor: '#185a32' });
            this.scene.sound.play('hover-button-sound', { volume: 0.3 });
        });

        actionBtn.on('pointerout', () => actionBtn.setStyle({ color: '#55ff99', backgroundColor: '#0d381e' }));

        actionBtn.on('pointerdown', () => {
            if (this.scene.bgMusic) this.scene.bgMusic.stop();
            // Startet das nächste Level (Level 2, Level 3 oder wieder 1)
            this.scene.scene.restart({ level: nextLevel });
        });

        // Button: Menü
        const menuBtn = this.scene.add.text(centerX, boxY + 175, 'MENÜ', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#aaaaaa',
            backgroundColor: '#1f1f1f',
            padding: { x: 16, y: 6 }
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(202)
            .setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => {
            menuBtn.setStyle({ color: '#ffffff', backgroundColor: '#3a3a3a' });
            this.scene.sound.play('hover-button-sound', { volume: 0.3 });
        });

        menuBtn.on('pointerout', () => menuBtn.setStyle({ color: '#aaaaaa', backgroundColor: '#1f1f1f' }));

        menuBtn.on('pointerdown', () => {
            if (this.scene.bgMusic) this.scene.bgMusic.stop();
            this.scene.scene.start('MenuScene');
        });
    }
}