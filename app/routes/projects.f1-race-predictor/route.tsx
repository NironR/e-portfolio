import type { MetaFunction } from '@remix-run/cloudflare';
import backgroundImg from '~/assets/f1-background.jpg';
import backgroundImgLarge from '~/assets/f1-background-large.jpg';
import backgroundImgPlaceholder from '~/assets/f1-background-placeholder.jpg';
import racesImg from '~/assets/f1-races.jpg';
import racesImgLarge from '~/assets/f1-races-large.jpg';
import racesImgPlaceholder from '~/assets/f1-races-placeholder.jpg';
import modelsImg from '~/assets/f1-models.jpg';
import modelsImgLarge from '~/assets/f1-models-large.jpg';
import modelsImgPlaceholder from '~/assets/f1-models-placeholder.jpg';
import resultsImg from '~/assets/f1-results.jpg';
import resultsImgLarge from '~/assets/f1-results-large.jpg';
import resultsImgPlaceholder from '~/assets/f1-results-placeholder.jpg';
import { Button } from '~/components/button';
import {
    ProjectBackground,
    ProjectContainer,
    ProjectHeader,
    ProjectImage,
    ProjectSection,
    ProjectSectionContent,
    ProjectSectionHeading,
    ProjectSectionText,
    ProjectTextRow,
} from '~/layout/project';
import config from '~/config.json';

const title = 'F1 Race Predictor';
const description =
    'A machine learning project that predicts every Formula 1 race before the lights go out, then scores each call against what really happened. It rebuilds itself after every Grand Prix.';
const roles = ['Machine Learning', 'Data Pipeline', 'Python', 'Front End Development'];
const site = 'https://nironr.github.io/f1-predictor/';
const repo = 'https://github.com/NironR/f1-predictor';

export const meta: MetaFunction = () => [
    { title: `${title} | ${config.name}` },
    { name: 'description', content: description },
];

const image = (src: string, large: string) => `${src} 1280w, ${large} 2560w`;

export default function F1RacePredictor() {
    return (
        <ProjectContainer>
            <ProjectBackground
                opacity={0.6}
                src={backgroundImg}
                srcSet={`${backgroundImg} 1080w, ${backgroundImgLarge} 2160w`}
                placeholder={backgroundImgPlaceholder}
            />
            <ProjectHeader title={title} description={description} url={site} roles={roles} />
            <ProjectSection padding="top">
                <ProjectSectionContent>
                    <ProjectImage
                        raised
                        srcSet={image(racesImg, racesImgLarge)}
                        placeholder={racesImgPlaceholder}
                        width={1280}
                        height={800}
                        sizes="(max-width: 1040px) 100vw, 80vw"
                        alt="The race explorer: where each driver started, where the model placed them, and where they finished."
                    />
                </ProjectSectionContent>
            </ProjectSection>
            <ProjectSection>
                <ProjectTextRow>
                    <ProjectSectionHeading>Beating the grid</ProjectSectionHeading>
                    <ProjectSectionText>
                        The starting grid is a hard baseline to beat: most drivers finish close to
                        where they start. Every model here is scored against the simplest guess, and
                        trained only on races before the one it predicts, across every season since
                        2021.
                    </ProjectSectionText>
                </ProjectTextRow>
            </ProjectSection>
            <ProjectSection>
                <ProjectSectionContent>
                    <ProjectTextRow>
                        <ProjectSectionHeading>Before the race</ProjectSectionHeading>
                        <ProjectSectionText>
                            A gradient-boosted model ranks the finishing order from qualifying gaps,
                            team form and weather, reaching a rank correlation of 0.667 against the
                            grid's 0.633 over 134 races. A lap-by-lap hazard model scores safety car
                            risk with an AUC of 0.79, against 0.59 for the lap-one rule of thumb.
                        </ProjectSectionText>
                    </ProjectTextRow>
                    <ProjectImage
                        raised
                        srcSet={image(modelsImg, modelsImgLarge)}
                        placeholder={modelsImgPlaceholder}
                        width={1280}
                        height={1600}
                        sizes="(max-width: 1040px) 100vw, 80vw"
                        alt="Model cards: safety car risk per lap, tyre wear by compound, team wear against the field, and the pit window."
                    />
                </ProjectSectionContent>
            </ProjectSection>
            <ProjectSection>
                <ProjectTextRow>
                    <ProjectSectionHeading>During the race</ProjectSectionHeading>
                    <ProjectSectionText>
                        Tyre wear is fitted per compound on clean laps with fuel burn taken out, then
                        updated from the race's own laps: after 40 laps the error falls from 0.033 to
                        0.021 seconds per lap. A multi-car simulator with safety car reactions drives a
                        live assistant that names the first pit lap eight laps out. It lands within
                        three laps 31% of the time, against 26% for the plan made before the start.
                    </ProjectSectionText>
                </ProjectTextRow>
            </ProjectSection>
            <ProjectSection>
                <ProjectSectionContent>
                    <ProjectTextRow>
                        <ProjectSectionHeading>Keeping it honest</ProjectSectionHeading>
                        <ProjectSectionText>
                            Not every idea paid off, and the results page says so: the pit-or-stay
                            call under a safety car is no better than always pitting. After each race
                            weekend a GitHub Action fetches the new data, re-fits the models, runs the
                            core checks and redeploys the page.
                        </ProjectSectionText>
                    </ProjectTextRow>
                    <ProjectImage
                        raised
                        srcSet={image(resultsImg, resultsImgLarge)}
                        placeholder={resultsImgPlaceholder}
                        width={1280}
                        height={800}
                        sizes="(max-width: 1040px) 100vw, 80vw"
                        alt="Every model measured against a simple baseline, scored on races it never saw."
                    />
                </ProjectSectionContent>
            </ProjectSection>
            <ProjectSection>
                <ProjectTextRow center>
                    <ProjectSectionHeading>See it run</ProjectSectionHeading>
                    <ProjectSectionText>
                        The results page follows every race since 2021, and the code covers the whole
                        pipeline, from fetching the data to the page itself.
                    </ProjectSectionText>
                    <Button iconHoverShift href={site} iconEnd="arrow-right">
                        Visit website
                    </Button>
                    <Button secondary iconHoverShift href={repo} icon="github">
                        View the code
                    </Button>
                </ProjectTextRow>
            </ProjectSection>
        </ProjectContainer>
    );
}
